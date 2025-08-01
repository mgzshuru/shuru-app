"use client"

import Link from 'next/link'

export default function MagazineSlugNotFound() {
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4 font-['IBM_Plex_Sans_Arabic']">
          العدد غير موجود
        </h1>

        <p className="text-gray-600 mb-8 leading-relaxed font-['IBM_Plex_Sans_Arabic']">
          العدد الذي تحاول الوصول إليه غير متوفر حالياً. قد يكون الرابط غير صحيح أو أن العدد لم يعد متاحاً.
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
            اقتراحات أخرى
          </h3>
          <ul className="text-gray-600 space-y-2 font-['IBM_Plex_Sans_Arabic']">
            <li>• تأكد من صحة الرابط</li>
            <li>• تصفح الأعداد الحديثة من المجلة</li>
            <li>• ابحث عن المحتوى المطلوب في المقالات</li>
            <li>• استخدم أداة البحث في الموقع</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
