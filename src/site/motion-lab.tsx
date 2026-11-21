import { useState } from "react"
import { Button } from "@/registry/default/ui/button"

const EASINGS = [
  { token: "--ease-out", use: "Enter and exit" },
  { token: "--ease-in-out", use: "Movement on screen" },
  { token: "--ease-slide", use: "Pills and anything crossing a container" },
  { token: "--ease-spring", use: "Press release (overshoots)" },
]

const DURATIONS = [
  { token: "--duration-press", ms: 140, use: "Press in" },
  { token: "--duration-release", ms: 200, use: "Release" },
  { token: "--duration-fast", ms: 150, use: "Small popovers, hover" },
  { token: "--duration-slide", ms: 280, use: "Sliding pill" },
  { token: "--duration-shimmer", ms: 1500, use: "Skeleton sweep" },
]

export function MotionLab() {
  const [moved, setMoved] = useState(false)

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          <h3 className="font-medium">Easing</h3>
          <Button variant="outline" size="sm" onClick={() => setMoved((m) => !m)}>
            Play
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          {EASINGS.map(({ token, use }) => (
            <div key={token} className="grid grid-cols-[9rem_1fr] items-center gap-3 sm:grid-cols-[9rem_12rem_1fr]">
              <code className="text-xs">{token}</code>
              <span className="hidden text-xs text-muted-foreground sm:block">{use}</span>
              <div className="relative h-6 rounded-md bg-muted">
                <span aria-hidden className="absolute inset-y-1 left-[15%] w-px bg-border" />
                <span aria-hidden className="absolute inset-y-1 left-[85%] w-px bg-border" />
                <span
                  className="absolute top-1 size-4 rounded-full bg-primary transition-[left] duration-[calc(var(--duration-slide)*2)] motion-reduce:transition-none"
                  style={{
                    transitionTimingFunction: `var(${token})`,
                    left: moved ? "calc(85% - 0.5rem)" : "calc(15% - 0.5rem)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Each dot runs at twice the slide duration so the curve is easy to see, and moves between 15% and 85% of the
          track, so the overshoot of --ease-spring stays visible in both directions. The ticks mark the targets. Anything that crosses a container uses
          --ease-slide. Components never animate left, this is only a lab.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="font-medium">Durations</h3>
        <table className="w-full text-sm">
          <tbody>
            {DURATIONS.map(({ token, ms, use }) => (
              <tr key={token} className="border-b last:border-0">
                <td className="py-2 pr-3">
                  <code className="text-xs">{token}</code>
                </td>
                <td className="py-2 pr-3 tabular-nums">{ms >= 1000 ? `${ms / 1000}s` : `${ms}ms`}</td>
                <td className="py-2 text-muted-foreground">{use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="font-medium">Checks</h3>
        <ul className="list-disc pl-5 text-sm text-muted-foreground">
          <li>Slow the animations 4x (DevTools Animations panel) to see origin, overshoot and that nothing else moves.</li>
          <li>Click two neighbouring items fast: the pill retargets, it never restarts.</li>
          <li>Turn on reduced motion in your OS: colour stays, movement goes.</li>
          <li>Hold a button down: it stays pressed and doesn't tween while held.</li>
        </ul>
      </section>
    </div>
  )
}
