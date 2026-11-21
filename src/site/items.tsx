import type { ComponentType } from "react"
import ButtonDemo from "@/registry/default/examples/button-demo"
import SegmentedControlDemo from "@/registry/default/examples/segmented-control-demo"
import SkeletonDemo from "@/registry/default/examples/skeleton-demo"
import TabsDemo from "@/registry/default/examples/tabs-demo"

export type GalleryItem = {
  name: string
  title: string
  description: string
  provenance: string
  Demo: ComponentType
}

export const items: GalleryItem[] = [
  {
    name: "button",
    title: "Button",
    description:
      "Raised at rest, presses in quickly, springs back slower. Ghost and icon buttons get the press only.",
    provenance: "shadcn base-nova button. Press idea from sevenui, top highlight from coss.",
    Demo: ButtonDemo,
  },
  {
    name: "tabs",
    title: "Tabs",
    description:
      "The pill slides to the new tab on a light spring. The pressed tab squishes, labels change colour only.",
    provenance: "Base UI Tabs and its indicator. Written from scratch.",
    Demo: TabsDemo,
  },
  {
    name: "segmented-control",
    title: "Segmented control",
    description:
      "A single-choice toggle group that always keeps one value. Same pill as tabs, also follows links and radios.",
    provenance: "Base UI ToggleGroup. Indicator adapted from Milly, idea from coss's segmented control.",
    Demo: SegmentedControlDemo,
  },
  {
    name: "skeleton",
    title: "Skeleton",
    description:
      "One synced shimmer across the page. useSkeleton waits 150ms before showing and holds at least 300ms.",
    provenance: "Synced shimmer idea from cubby-ui. Written from scratch.",
    Demo: SkeletonDemo,
  },
]
