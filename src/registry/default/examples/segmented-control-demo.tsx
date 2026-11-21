import { useState } from "react"
import { SegmentedControl, SegmentedControlItem } from "@/registry/default/ui/segmented-control"

export default function SegmentedControlDemo() {
  const [range, setRange] = useState("month")
  return (
    <div className="flex flex-col items-start gap-3">
      <SegmentedControl value={range} onValueChange={setRange} aria-label="Date range">
        <SegmentedControlItem value="week">Week</SegmentedControlItem>
        <SegmentedControlItem value="month">Month</SegmentedControlItem>
        <SegmentedControlItem value="quarter">Quarter</SegmentedControlItem>
        <SegmentedControlItem value="year">Year</SegmentedControlItem>
      </SegmentedControl>
      <p className="text-sm text-muted-foreground">
        Showing this <span className="text-foreground">{range}</span>.
      </p>
    </div>
  )
}
