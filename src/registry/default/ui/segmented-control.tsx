// @tonylxm/segmented-control v0.1.3. Base UI toggle group, single choice, with a sliding pill.
// Needs @tonylxm/tactile, @tonylxm/sliding-indicator and @tonylxm/use-press.
import * as React from "react"
import { Toggle } from "@base-ui/react/toggle"
import { ToggleGroup } from "@base-ui/react/toggle-group"
import { cn } from "@/lib/utils"
import { usePress } from "@/registry/default/hooks/use-press"
import { SlidingIndicator } from "@/registry/default/ui/sliding-indicator"

type SegmentedControlProps = Omit<
  ToggleGroup.Props,
  "value" | "defaultValue" | "onValueChange" | "multiple"
> & {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
}

// A segmented control always has one choice: pressing the selected item again keeps it selected,
// which a plain toggle group would clear.
function SegmentedControl({
  value: valueProp,
  defaultValue,
  onValueChange,
  className,
  children,
  ...props
}: SegmentedControlProps) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue)
  const value = valueProp ?? uncontrolled

  return (
    <ToggleGroup
      data-slot="segmented-control"
      value={value === undefined ? [] : [value]}
      onValueChange={(next) => {
        const picked = next[0]
        if (picked === undefined) return
        setUncontrolled(picked)
        onValueChange?.(picked)
      }}
      className={cn(
        "relative z-0 inline-flex w-fit items-center rounded-lg bg-muted p-0.5 text-muted-foreground",
        className
      )}
      {...props}
    >
      <SlidingIndicator className="inset-y-0.5 -z-1 rounded-md bg-background shadow-sm dark:bg-input/40" />
      {children}
    </ToggleGroup>
  )
}

function SegmentedControlItem({ className, ...props }: Toggle.Props) {
  const press = usePress(props)
  return (
    <Toggle
      data-slot="segmented-control-item"
      className={cn(
        "inline-flex h-7 items-center justify-center gap-1.5 rounded-md px-3 text-sm font-medium whitespace-nowrap outline-none select-none",
        "transition-[color,scale] duration-(--duration-release) ease-(--ease-spring) data-down:scale-96 data-down:duration-(--duration-press) data-down:ease-out motion-reduce:data-down:scale-100",
        "hover:text-foreground data-pressed:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
        className
      )}
      {...props}
      {...press}
    />
  )
}

export { SegmentedControl, SegmentedControlItem }
