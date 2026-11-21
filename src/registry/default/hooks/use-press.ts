// @tonylxm/use-press v0.1.0. Press-in that stays visible long enough to see on a quick tap.
import * as React from "react"

type PressHandlers = Pick<
  React.ComponentProps<"button">,
  "onPointerDown" | "onPointerUp" | "onPointerCancel" | "onPointerLeave" | "onKeyDown" | "onKeyUp" | "onBlur"
>

// A tap lasts about 15-40ms, shorter than the press-in transition, so :active barely shows on a trackpad
// and lingers unpredictably on touch. This sets `data-down` on pointer or key down and removes it on
// release, but never sooner than `minHold` ms after it was set. Style the pressed look with `data-down:`.
function usePress(props: PressHandlers, minHold = 90): PressHandlers {
  const current = React.useRef<{ el: HTMLElement; at: number } | null>(null)
  const timer = React.useRef<number | undefined>(undefined)

  React.useEffect(
    () => () => {
      window.clearTimeout(timer.current)
      current.current?.el.removeAttribute("data-down")
    },
    []
  )

  const press = (el: HTMLElement) => {
    if (el.matches(":disabled, [aria-disabled='true'], [data-disabled]")) return
    window.clearTimeout(timer.current)
    current.current = { el, at: performance.now() }
    el.setAttribute("data-down", "")
  }

  const release = () => {
    const pressed = current.current
    if (!pressed) return
    window.clearTimeout(timer.current)
    const clear = () => {
      pressed.el.removeAttribute("data-down")
      if (current.current === pressed) current.current = null
    }
    const left = minHold - (performance.now() - pressed.at)
    if (left > 0) timer.current = window.setTimeout(clear, left)
    else clear()
  }

  return {
    onPointerDown: (e) => {
      props.onPointerDown?.(e)
      if (e.button === 0) press(e.currentTarget)
    },
    onPointerUp: (e) => {
      props.onPointerUp?.(e)
      release()
    },
    onPointerCancel: (e) => {
      props.onPointerCancel?.(e)
      release()
    },
    onPointerLeave: (e) => {
      props.onPointerLeave?.(e)
      release()
    },
    onKeyDown: (e) => {
      props.onKeyDown?.(e)
      if ((e.key === " " || e.key === "Enter") && !e.repeat) press(e.currentTarget)
    },
    onKeyUp: (e) => {
      props.onKeyUp?.(e)
      release()
    },
    onBlur: (e) => {
      props.onBlur?.(e)
      release()
    },
  }
}

export { usePress }
