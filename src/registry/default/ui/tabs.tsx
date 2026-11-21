// @tonylxm/tabs v0.1.3. Base UI tabs with a sliding pill (Base UI measures it). Needs @tonylxm/tactile and @tonylxm/use-press.
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { cn } from "@/lib/utils"
import { usePress } from "@/registry/default/hooks/use-press"

function Tabs({ className, ...props }: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

// The list holds the indicator, so it is always rendered: pass `indicator={false}` only for a list that
// shows no selection highlight.
function TabsList({
  className,
  children,
  indicator = true,
  ...props
}: TabsPrimitive.List.Props & { indicator?: boolean }) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "relative z-0 inline-flex w-fit items-center rounded-lg bg-muted p-0.5 text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
      {indicator && <TabsIndicator />}
    </TabsPrimitive.List>
  )
}

function TabsTab({ className, ...props }: TabsPrimitive.Tab.Props) {
  const press = usePress(props)
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-tab"
      className={cn(
        "inline-flex h-7 items-center justify-center gap-1.5 rounded-md px-3 text-sm font-medium whitespace-nowrap outline-none select-none",
        // Colour only on the label. The squish on press is the item itself; the pill handles position.
        "transition-[color,scale] duration-(--duration-release) ease-(--ease-spring) data-down:scale-96 data-down:duration-(--duration-press) data-down:ease-out motion-reduce:data-down:scale-100",
        "hover:text-foreground data-active:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
        className
      )}
      {...props}
      {...press}
    />
  )
}

function TabsIndicator({ className, ...props }: TabsPrimitive.Indicator.Props) {
  return (
    <TabsPrimitive.Indicator
      data-slot="tabs-indicator"
      className={cn(
        "absolute top-0.5 left-0 -z-1 h-(--active-tab-height) w-(--active-tab-width) translate-x-(--active-tab-left) rounded-md bg-background shadow-sm dark:bg-input/40",
        "transition-[translate,width] duration-(--duration-slide) ease-(--ease-slide) motion-reduce:transition-none",
        className
      )}
      {...props}
    />
  )
}

function TabsPanel({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-panel"
      className={cn("text-sm outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTab, TabsIndicator, TabsPanel }
