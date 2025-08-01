"use client"

import { useEffect } from 'react'
import Link from 'next/link'

export default function MagazineError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Magazine page error:', error)
  }, [error])

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

        <h1 className="text-3xl font-bold text-gray-900 mb-4 font-['IBM_Plex_Sans_Arabic']">
          خطأ في تحميل المجلة
        </h1>

        <p className="text-gray-600 mb-8 leading-relaxed font-['IBM_Plex_Sans_Arabic']">
          نعتذر عن هذا الخطأ في تحميل محتوى المجلة. يرجى المحاولة مرة أخرى أو تصفح أقسام أخرى من الموقع.
        </p>

        <div className="space-y-4">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 font-['IBM_Plex_Sans_Arabic']"
          >
            إعادة تحميل المجلة
          </button>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/magazine"
              className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200 font-['IBM_Plex_Sans_Arabic']"
            >
              العودة لقائمة المجلات
            </Link>

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

        {process.env.NODE_ENV === 'development' && error && (
          <details className="mt-8 text-left">
            <summary className="cursor-pointer text-gray-500 font-mono text-sm mb-2">
              تفاصيل الخطأ (بيئة التطوير)
            </summary>
            <div className="p-4 bg-gray-100 rounded-lg">
              <p className="font-semibold text-red-600 mb-2">Error Message:</p>
              <p className="text-sm mb-4 font-mono">{error.message}</p>
              {error.stack && (
                <>
                  <p className="font-semibold text-red-600 mb-2">Stack Trace:</p>
                  <pre className="text-xs overflow-auto font-mono bg-white p-2 rounded border">
                    {error.stack}
                  </pre>
                </>
              )}
            </div>
          </details>
        )}
      </div>
    </div>
  )
}
