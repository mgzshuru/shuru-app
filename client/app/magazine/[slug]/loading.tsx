export default function MagazineSlugLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb Skeleton */}
      <nav className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className="h-4 bg-gray-300 rounded w-16 animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-1 animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-16 animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-1 animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-20 animate-pulse"></div>
          </div>
        </div>
      </nav>

      {/* Hero Section Skeleton */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Cover Image Skeleton */}
            <div className="lg:sticky lg:top-24">
              <div className="aspect-[3/4] bg-gray-300 rounded-lg animate-pulse shadow-2xl"></div>
              <div className="mt-6">
                <div className="h-12 bg-gray-300 rounded-lg animate-pulse"></div>
              </div>
            </div>

            {/* Issue Details Skeleton */}
            <div className="space-y-8">
              <div>
                <div className="h-8 bg-gray-300 rounded-full w-24 mb-4 animate-pulse"></div>
                <div className="h-12 bg-gray-300 rounded mb-6 animate-pulse"></div>
                <div className="h-6 bg-gray-300 rounded mb-6 w-48 animate-pulse"></div>

                <div className="space-y-3">
                  <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-300 rounded w-5/6 animate-pulse"></div>
                  <div className="h-4 bg-gray-300 rounded w-4/6 animate-pulse"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/6 animate-pulse"></div>
                </div>
              </div>

              {/* Articles Skeleton */}
              <div>
                <div className="h-8 bg-gray-300 rounded w-40 mb-6 animate-pulse"></div>
                <div className="space-y-6">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex gap-4 p-4 border border-gray-200 rounded-lg">
                      <div className="w-24 h-24 bg-gray-300 rounded-lg animate-pulse"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-5 bg-gray-300 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-300 rounded w-4/5 animate-pulse"></div>
                        <div className="h-3 bg-gray-300 rounded w-32 animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Share Section Skeleton */}
              <div className="border-t border-gray-200 pt-8">
                <div className="h-6 bg-gray-300 rounded w-32 mb-4 animate-pulse"></div>
                <div className="flex space-x-4 rtl:space-x-reverse">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="w-10 h-10 bg-gray-300 rounded-full animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Skeleton */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="h-8 bg-gray-300 rounded w-48 mx-auto mb-4 animate-pulse"></div>
            <div className="h-12 bg-gray-300 rounded w-40 mx-auto animate-pulse"></div>
          </div>
        </div>
      </section>
    </div>
  )
}
