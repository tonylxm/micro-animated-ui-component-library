import { expect, test, type Page } from "@playwright/test"

async function noConsoleErrors(page: Page) {
  const errors: string[] = []
  page.on("pageerror", (e) => errors.push(e.message))
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()))
  return errors
}

test("every panel renders at phone width with no sideways scroll", async ({ page }) => {
  const errors = await noConsoleErrors(page)
  await page.goto("/")
  for (const name of ["Button", "Tabs", "Segmented control", "Skeleton", "Motion lab"]) {
    await page.getByRole("tab", { name, exact: true }).first().click()
    await expect(page.getByRole("tabpanel", { name, exact: true })).toBeVisible()
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    )
    expect(overflow, `${name} overflows`).toBe(0)
  }
  expect(errors).toEqual([])
})

test("segmented control keeps one choice and works by keyboard", async ({ page }) => {
  await page.goto("/")
  await page.getByRole("tab", { name: "Segmented control" }).click()
  const range = page.getByRole("group", { name: "Date range" })
  const month = range.getByRole("button", { name: "Month" })
  const quarter = range.getByRole("button", { name: "Quarter" })

  await month.click()
  await month.click()
  await expect(month).toHaveAttribute("aria-pressed", "true")

  await month.focus()
  await page.keyboard.press("ArrowRight")
  await expect(quarter).toBeFocused()
  await page.keyboard.press("Enter")
  await expect(quarter).toHaveAttribute("aria-pressed", "true")
  await expect(month).toHaveAttribute("aria-pressed", "false")
})

test("theme toggle flips the page and remembers the choice", async ({ page }) => {
  await page.goto("/")
  const toggle = page.getByRole("button", { name: "Dark theme" })
  const html = page.locator("html")
  const before = await html.evaluate((el) => el.classList.contains("dark"))

  await toggle.click()
  await expect.poll(() => html.evaluate((el) => el.classList.contains("dark"))).toBe(!before)
  await expect(toggle).toHaveAttribute("aria-pressed", String(!before))

  await page.reload()
  expect(await html.evaluate((el) => el.classList.contains("dark"))).toBe(!before)
})

test.describe("theme toggle without motion", () => {
  test.use({ reducedMotion: "reduce" })

  test("switches at once with no view transition", async ({ page }) => {
    await page.goto("/")
    const html = page.locator("html")
    const before = await html.evaluate((el) => el.classList.contains("dark"))
    await page.getByRole("button", { name: "Dark theme" }).click()
    expect(await html.evaluate((el) => el.classList.contains("dark"))).toBe(!before)
  })
})

test("tabs move by arrow keys", async ({ page }) => {
  await page.goto("/")
  await page.getByRole("tab", { name: "Button" }).focus()
  await page.keyboard.press("ArrowRight")
  await page.keyboard.press("Enter")
  await expect(page.getByRole("tab", { name: "Tabs", exact: true })).toHaveAttribute("aria-selected", "true")
})

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" })

  test("drops movement, keeps the change", async ({ page }) => {
    await page.goto("/")
    const indicator = page.locator("[data-slot=tabs-indicator]").first()
    await expect(indicator).toHaveCSS("transition-property", "none")

    await page.getByRole("tab", { name: "Segmented control" }).click()
    const pill = page.locator("[data-slot=sliding-indicator]").first()
    await expect(pill).toHaveCSS("transition-property", "none")

    await page.getByRole("tab", { name: "Skeleton" }).click()
    await page.getByRole("button", { name: "Reload" }).click()
    const skeleton = page.locator("[data-slot=skeleton]").first()
    await expect(skeleton).toBeVisible()
    await expect(skeleton).toHaveCSS("animation-name", "none")
  })
})

test("skeleton box keeps its size when content arrives", async ({ page }) => {
  await page.goto("/")
  await page.getByRole("tab", { name: "Skeleton" }).click()
  const panel = page.getByRole("tabpanel", { name: "Skeleton" })
  const box = panel.locator(".rounded-xl.border.p-3")
  await expect(panel.locator("[data-slot=skeleton]").first()).toBeVisible()
  const loading = await box.boundingBox()
  await expect(panel.getByText("Ada Lovelace")).toBeVisible()
  const loaded = await box.boundingBox()
  expect(loaded?.height).toBe(loading?.height)
})

test("a sliding pill never leaves its control mid-move", async ({ page }) => {
  await page.goto("/")
  const tabs = page.getByRole("tab")
  await tabs.first().click()
  await page.waitForTimeout(500)

  const overshoot = await page.evaluate(async () => {
    const list = document.querySelector("[data-slot=tabs-list]")!
    const pill = document.querySelector("[data-slot=tabs-indicator]")!
    const all = document.querySelectorAll<HTMLElement>("[data-slot=tabs-tab]")
    let worst = 0
    const timer = setInterval(() => {
      const out = pill.getBoundingClientRect().right - list.getBoundingClientRect().right
      worst = Math.max(worst, out)
    }, 8)
    all[all.length - 1].click()
    await new Promise((r) => setTimeout(r, 700))
    clearInterval(timer)
    return worst
  })
  expect(overshoot).toBeLessThanOrEqual(0)
})

test("theme toggle stays top right at phone width", async ({ page }) => {
  await page.goto("/")
  const toggle = (await page.getByRole("button", { name: "Dark theme" }).boundingBox())!
  const title = (await page.getByRole("heading", { name: "Tactile UI" }).boundingBox())!
  const viewport = page.viewportSize()!
  expect(toggle.y).toBeLessThan(title.y + title.height)
  expect(viewport.width - (toggle.x + toggle.width)).toBeLessThanOrEqual(24)
})

// A quick tap must show the press-in, and must let go soon after: not flash past, not stay stuck.
async function sampleTap(page: Page, act: () => Promise<void>) {
  const button = page.getByRole("button", { name: "Save changes" })
  await button.evaluate((node) => {
    const samples: { t: number; scale: number; down: boolean }[] = []
    ;(window as unknown as { __tap: typeof samples }).__tap = samples
    const tick = () => {
      const scale = getComputedStyle(node).scale
      samples.push({
        t: performance.now(),
        scale: scale === "none" ? 1 : parseFloat(scale),
        down: node.hasAttribute("data-down"),
      })
      requestAnimationFrame(tick)
    }
    tick()
  })
  await act()
  await page.waitForTimeout(600)
  const samples = await page.evaluate(
    () => (window as unknown as { __tap: { t: number; scale: number; down: boolean }[] }).__tap
  )
  const down = samples.filter((s) => s.down)
  return {
    minScale: Math.min(...samples.map((s) => s.scale)),
    heldMs: down.length ? down[down.length - 1].t - down[0].t : 0,
    stuck: samples[samples.length - 1].down,
  }
}

test("a quick click presses in for a visible moment, then lets go", async ({ page }) => {
  await page.goto("/")
  const button = page.getByRole("button", { name: "Save changes" })
  const box = (await button.boundingBox())!
  const result = await sampleTap(page, async () => {
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
    await page.mouse.down()
    await page.waitForTimeout(15)
    await page.mouse.up()
  })
  expect(result.minScale).toBeLessThan(0.985)
  expect(result.heldMs).toBeGreaterThan(60)
  expect(result.heldMs).toBeLessThan(250)
  expect(result.stuck).toBe(false)
})

test("a touch tap presses in, then lets go without lingering", async ({ page }) => {
  await page.goto("/")
  const button = page.getByRole("button", { name: "Save changes" })
  const box = (await button.boundingBox())!
  const result = await sampleTap(page, () =>
    page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2)
  )
  expect(result.minScale).toBeLessThan(0.985)
  expect(result.heldMs).toBeGreaterThan(60)
  expect(result.heldMs).toBeLessThan(250)
  expect(result.stuck).toBe(false)
})
