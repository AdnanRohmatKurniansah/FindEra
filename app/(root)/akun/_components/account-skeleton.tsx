const AccountProfileSkeleton = () => {
  return (
    <>
      <div className="border shadow-md rounded-md p-4 mb-8 animate-pulse">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-full bg-gray-200" />
        </div>
        <div className="space-y-2 text-center">
          <div className="h-5 w-32 bg-gray-200 rounded mx-auto" />
          <div className="h-4 w-24 bg-gray-200 rounded mx-auto" />
          <div className="h-10 w-full bg-gray-200 rounded-md mt-3" />
        </div>
      </div>
      <div className="border shadow-md rounded-md p-4 animate-pulse">
        <div className="h-5 w-40 bg-gray-200 rounded mb-4" />
        <div className="space-y-4">
          <div className="h-10 w-48 bg-gray-200 rounded" />
          <div className="h-10 w-40 bg-gray-200 rounded" />
          <div className="h-10 w-44 bg-gray-200 rounded" />
        </div>
      </div>
    </>
  )
}

export default AccountProfileSkeleton