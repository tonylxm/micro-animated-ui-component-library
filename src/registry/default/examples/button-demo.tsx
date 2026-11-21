import { ArrowRight, Plus } from "lucide-react"
import { Button } from "@/registry/default/ui/button"

export default function ButtonDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button>Save changes</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
      <Button size="icon" variant="outline" aria-label="Add">
        <Plus />
      </Button>
      <Button size="lg">
        Continue <ArrowRight data-icon="inline-end" />
      </Button>
      <Button disabled>Disabled</Button>
    </div>
  )
}
