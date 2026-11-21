// @tonylxm/sliding-indicator v0.1.2. Adapted from Milly's SlidingIndicator.
import { useLayoutEffect, useRef } from "react"
import { cn } from "@/lib/utils"

// The item a control marks as selected: a pressed toggle, a link with aria-current, or a label wrapping a
// checked radio.
const ACTIVE = [
  ":scope > [data-pressed]",
  ":scope > [aria-pressed='true']",
  ":scope > [aria-current]:not([aria-current='false'])",
  ":scope > :has(input:checked)",
].join(", ")

// One highlight that slides between a control's items instead of jumping. Put it first inside a
// `relative` control. A click moves it at once, so a link that waits on the server still answers the
// press. Afterwards it follows the selected item, and it re-measures when fonts load or layout reflows.
function SlidingIndicator({ className }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    const pill = ref.current
    const control = pill?.parentElement
    if (!pill || !control) return

    const place = (item: HTMLElement | null) => {
      if (!item || item.offsetWidth === 0) {
        pill.removeAttribute("data-placed")
        return
      }
      pill.style.translate = `${item.offsetLeft}px 0`
      pill.style.width = `${item.offsetWidth}px`
      pill.setAttribute("data-placed", "")
    }
    const sync = () => place(control.querySelector<HTMLElement>(ACTIVE))

    sync()
    control.setAttribute("data-indicator", "")
    // Transitions start after the first placement, so the page doesn't load with the pill sliding in.
    const frame = requestAnimationFrame(() => pill.setAttribute("data-ready", ""))

    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      let item = e.target as HTMLElement | null
      while (item && item.parentElement !== control) item = item.parentElement
      if (item && item !== pill && !item.matches("[data-disabled], :disabled")) place(item)
    }
    control.addEventListener("click", onClick)
    control.addEventListener("change", sync)
    const mutations = new MutationObserver(sync)
    mutations.observe(control, {
      subtree: true,
      attributes: true,
      attributeFilter: ["aria-current", "aria-pressed", "data-pressed"],
    })
    const resize = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(sync)
    resize?.observe(control)

    return () => {
      cancelAnimationFrame(frame)
      control.removeEventListener("click", onClick)
      control.removeEventListener("change", sync)
      mutations.disconnect()
      resize?.disconnect()
      control.removeAttribute("data-indicator")
    }
  }, [])

  return (
    <span
      ref={ref}
      aria-hidden
      data-slot="sliding-indicator"
      className={cn(
        "pointer-events-none absolute left-0 opacity-0 data-placed:opacity-100",
        "data-ready:transition-[translate,width,opacity] data-ready:duration-(--duration-slide) data-ready:ease-(--ease-slide) motion-reduce:data-ready:transition-none",
        className
      )}
    />
  )
}

export { SlidingIndicator }
