export default function MagazineLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section Skeleton */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <div className="h-16 bg-gray-300 rounded-lg mb-6 animate-pulse"></div>
            <div className="h-6 bg-gray-300 rounded mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-300 rounded w-3/4 mx-auto animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Featured Issues Skeleton */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="h-8 bg-gray-300 rounded w-48 mb-4 animate-pulse"></div>
            <div className="w-16 h-1 bg-gray-300 animate-pulse"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white border border-gray-200 shadow-lg">
                <div className="aspect-[3/4] bg-gray-300 animate-pulse"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-300 rounded mb-3 animate-pulse"></div>
                  <div className="h-4 bg-gray-300 rounded mb-3 w-24 animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-3 bg-gray-300 rounded w-4/5 animate-pulse"></div>
                    <div className="h-3 bg-gray-300 rounded w-3/5 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Issues Skeleton */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="h-8 bg-gray-300 rounded w-48 mb-4 animate-pulse"></div>
            <div className="w-16 h-1 bg-gray-300 animate-pulse"></div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div key={item} className="bg-white border border-gray-200">
                <div className="aspect-[3/4] bg-gray-300 animate-pulse"></div>
                <div className="p-4">
                  <div className="h-5 bg-gray-300 rounded mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-300 rounded w-20 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
