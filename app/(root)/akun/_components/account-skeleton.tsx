import { Skeleton } from "@/components/ui/skeleton"

const AccountProfileSkeleton = () => {
  return (
    <>
      <div className="border shadow-md rounded-md p-4 mb-8 animate-pulse">
        <div className="flex justify-center mb-4">
          <Skeleton className="w-20 h-20 rounded-full" />
        </div>
        <div className="space-y-2 text-center">
          <Skeleton className="h-5 w-32 mx-auto" />
          <Skeleton className="h-4 w-24 mx-auto" />
          <Skeleton className="h-10 w-full mt-3 rounded-md" />
        </div>
      </div>

      <div className="border shadow-md rounded-md p-4 animate-pulse mb-4">
        <Skeleton className="h-5 w-40 mb-4" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-52" />
        </div>
      </div>
      <div className="border shadow-md rounded-md p-4 animate-pulse">
        <Skeleton className="h-5 w-40 mb-4" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-52" />
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-48" />
        </div>
      </div>
    </>
  )
}

export default AccountProfileSkeleton
