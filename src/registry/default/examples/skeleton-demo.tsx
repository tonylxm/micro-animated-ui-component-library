import { useEffect, useState } from "react"
import { Button } from "@/registry/default/ui/button"
import { Skeleton, useSkeleton } from "@/registry/default/ui/skeleton"

export default function SkeletonDemo() {
  const [loading, setLoading] = useState(true)
  const showSkeleton = useSkeleton(loading)

  useEffect(() => {
    if (!loading) return
    const timer = setTimeout(() => setLoading(false), 1200)
    return () => clearTimeout(timer)
  }, [loading])

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      {/* Same box whether loading or loaded, so nothing moves when the content arrives. */}
      <div className="flex h-16 items-center gap-3 rounded-xl border p-3">
        {loading || showSkeleton ? (
          showSkeleton && (
            <>
              <Skeleton className="size-10 rounded-full" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-3.5 w-2/5" />
                <Skeleton className="h-3 w-3/5" />
              </div>
            </>
          )
        ) : (
          <div className="flex flex-1 animate-[tactile-fade-in_120ms_ease-out] items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-muted text-sm font-medium">
              AL
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Ada Lovelace</span>
              <span className="text-xs text-muted-foreground">Joined in March</span>
            </div>
          </div>
        )}
      </div>
      <Button variant="outline" className="self-start" onClick={() => setLoading(true)} disabled={loading}>
        Reload
      </Button>
    </div>
  )
}
