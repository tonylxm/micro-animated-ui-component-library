import { Moon, Sun } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/registry/default/ui/button"
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/registry/default/ui/tabs"
import { items, type GalleryItem } from "./items"
import { MotionLab } from "./motion-lab"

const NAMESPACE = "@tonylxm"

function readStored(key: string) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function store(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {
    // Private windows and blocked storage: the choice just isn't remembered.
  }
}

function useTheme() {
  const [theme, setTheme] = useState(
    () =>
      readStored("theme") ??
      (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
  )

  // The page cross-fades through a view transition (see index.css). Without one, or under reduced motion,
  // it switches at once with transitions off, so colours don't drift one by one.
  function toggle() {
    const next = theme === "dark" ? "light" : "dark"
    const root = document.documentElement
    setTheme(next)
    const swap = () => {
      root.classList.toggle("dark", next === "dark")
      store("theme", next)
    }
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches
    if (document.startViewTransition && !still) {
      document.startViewTransition(swap)
      return
    }
    root.classList.add("theme-switching")
    swap()
    requestAnimationFrame(() =>
      requestAnimationFrame(() => root.classList.remove("theme-switching"))
    )
  }

  return [theme, toggle] as const
}

// Same icon swap as Milly's theme toggle. CSS picks the icon from the dark class, so it is right before
// React has run.
function ThemeToggle({ theme, onToggle }: { theme: string; onToggle: () => void }) {
  const icon =
    "size-4 transition-[scale,rotate] duration-(--duration-release) ease-(--ease-out) motion-reduce:transition-none"
  return (
    <Button
      variant="outline"
      size="icon"
      aria-label="Dark theme"
      aria-pressed={theme === "dark"}
      onClick={onToggle}
    >
      <span className="relative inline-flex size-4">
        <Sun aria-hidden className={`${icon} scale-100 rotate-0 dark:scale-0 dark:-rotate-90`} />
        <Moon
          aria-hidden
          className={`${icon} absolute inset-0 scale-0 rotate-90 dark:scale-100 dark:rotate-0`}
        />
      </span>
    </Button>
  )
}

function InstallCommand({ name }: { name: string }) {
  const command = `pnpm dlx shadcn@latest add ${NAMESPACE}/${name}`
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(timer.current), [])
  return (
    <div className="flex min-w-0 items-center gap-2 rounded-lg border bg-muted/50 py-1 pr-1 pl-3">
      <code className="min-w-0 flex-1 truncate text-xs">{command}</code>
      <Button
        variant="ghost"
        size="sm"
        className="w-16"
        onClick={() => {
          navigator.clipboard.writeText(command).then(
            () => {
              setCopied(true)
              // One timer, restarted by every tap, so a spam of taps can't reset the label early.
              window.clearTimeout(timer.current)
              timer.current = window.setTimeout(() => setCopied(false), 1500)
            },
            () => {}
          )
        }}
      >
        {copied ? "Copied" : "Copy"}
      </Button>
    </div>
  )
}

function ItemPanel({ item }: { item: GalleryItem }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold">{item.title}</h2>
        <p className="text-sm text-muted-foreground">{item.description}</p>
      </div>
      <div className="flex min-h-48 items-center justify-center rounded-xl border p-6 sm:p-10">
        <item.Demo />
      </div>
      <InstallCommand name={item.name} />
      <p className="text-xs text-muted-foreground">{item.provenance}</p>
    </div>
  )
}

export function App() {
  const [theme, toggleTheme] = useTheme()

  return (
    <div className="mx-auto flex min-h-dvh max-w-3xl flex-col gap-8 px-4 py-8 sm:py-12">
      <header className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold">Tactile UI</h1>
          <p className="text-sm text-muted-foreground">
            Components with motion that feels physical. Install with shadcn from {NAMESPACE}.
          </p>
        </div>
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </header>

      <Tabs defaultValue={items[0].name} className="gap-6">
        {/* Scrolls sideways on a phone instead of wrapping, so the pill stays on one row. */}
        <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none]">
          <TabsList>
            {items.map((item) => (
              <TabsTab key={item.name} value={item.name}>
                {item.title}
              </TabsTab>
            ))}
            <TabsTab value="motion-lab">Motion lab</TabsTab>
          </TabsList>
        </div>
        {items.map((item) => (
          <TabsPanel key={item.name} value={item.name}>
            <ItemPanel item={item} />
          </TabsPanel>
        ))}
        <TabsPanel value="motion-lab">
          <MotionLab />
        </TabsPanel>
      </Tabs>
    </div>
  )
}
