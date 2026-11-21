// @tonylxm/skeleton v0.1.2. Synced shimmer plus show-delay timing. Needs @tonylxm/tactile.
import * as React from "react"
import { cn } from "@/lib/utils"

// bg-fixed pins the gradient to the viewport, so every skeleton on the page shows one sweep in sync,
// however late it mounted. Reduced motion gets the static fill.
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden
      className={cn(
        "rounded-md bg-muted",
        "motion-safe:bg-[linear-gradient(90deg,var(--muted)_40%,color-mix(in_oklch,var(--muted),var(--foreground)_6%)_50%,var(--muted)_60%)] motion-safe:bg-size-[200%_100%] motion-safe:bg-fixed motion-safe:animate-[tactile-shimmer_var(--duration-shimmer)_linear_infinite]",
        className
      )}
      {...props}
    />
  )
}

// Whether to show a skeleton for a load: only after `delay` ms, so a fast load never flashes one, and
// then for at least `minDuration` ms, so it never blinks off.
function useSkeleton(loading: boolean, { delay = 150, minDuration = 300 } = {}) {
  const [shown, setShown] = React.useState(false)
  const shownAt = React.useRef(0)

  React.useEffect(() => {
    if (loading) {
      // Already showing: leave shownAt alone, or the minimum hold would restart from this render.
      if (shown) return
      const timer = setTimeout(() => {
        shownAt.current = Date.now()
        setShown(true)
      }, delay)
      return () => clearTimeout(timer)
    }
    if (!shown) return
    const left = minDuration - (Date.now() - shownAt.current)
    const timer = setTimeout(() => setShown(false), Math.max(0, left))
    return () => clearTimeout(timer)
  }, [loading, shown, delay, minDuration])

  return shown
}

export { Skeleton, useSkeleton }
