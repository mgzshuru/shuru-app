"use client"

import Link from 'next/link'

export default function MagazineNotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="mb-8">
          <svg
            className="w-24 h-24 mx-auto text-gray-400 mb-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4 font-['IBM_Plex_Sans_Arabic']">
          العدد غير موجود
        </h1>

        <p className="text-gray-600 mb-8 leading-relaxed font-['IBM_Plex_Sans_Arabic']">
          العدد الذي تبحث عنه غير متوفر أو قد يكون الرابط غير صحيح. يمكنك تصفح الأعداد المتاحة أو العودة للصفحة الرئيسية.
        </p>

        <div className="space-y-4">
          <Link
            href="/magazine"
            className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 font-['IBM_Plex_Sans_Arabic']"
          >
            تصفح جميع الأعداد
          </Link>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/articles"
              className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200 font-['IBM_Plex_Sans_Arabic']"
            >
              تصفح المقالات
            </Link>

            <Link
              href="/"
              className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200 font-['IBM_Plex_Sans_Arabic']"
            >
              الصفحة الرئيسية
            </Link>
          </div>
        </div>

        <div className="mt-12 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 font-['IBM_Plex_Sans_Arabic']">
            هل تبحث عن شيء محدد؟
          </h3>
          <p className="text-gray-600 font-['IBM_Plex_Sans_Arabic']">
            يمكنك استخدام البحث للعثور على المحتوى الذي تريده أو تصفح الفئات المختلفة.
          </p>
        </div>
      </div>
    </div>
  )
}
