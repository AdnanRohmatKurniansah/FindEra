import { Skeleton } from "@/components/ui/skeleton"

const ItemDetailSkeleton = () => {
  return (
    <section className="py-10">
      <div className="mx-auto px-5 md:px-15">
        <Skeleton className="h-4 w-48 mb-6" />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-3">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <Skeleton className="w-full aspect-[4/3] rounded-[10px]" />
            <div className="p-5 border rounded-lg space-y-3">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
            <div className="border rounded-lg overflow-hidden">
              <div className="p-5 flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-4 w-48" />
              </div>
              <Skeleton className="w-full h-64" />
              <div className="p-4">
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          </div>
          <div className="relative md:sticky md:top-28 h-fit space-y-4">
            <div className="account-item space-y-5">
                <div className="p-5 border rounded-lg space-y-4">
                    <div className="flex items-center gap-4">
                    <Skeleton className="h-14 w-14 rounded-full" />
                    <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-3 w-32" />
                    </div>
                    </div>
                    <Skeleton className="h-10 w-full rounded-md" />
                    <Skeleton className="h-10 w-full rounded-md" />
                    <div className="mt-4 rounded-lg border bg-blue-50 p-4 space-y-3">
                        <Skeleton className="h-4 w-32" />
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="space-y-1">
                            <Skeleton className="h-3 w-48" />
                            <Skeleton className="h-3 w-64" />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="p-4 border rounded-[10px] space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ItemDetailSkeleton
