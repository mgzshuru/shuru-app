"use client"

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-50">
      <div className="text-center max-w-md">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 font-['IBM_Plex_Sans_Arabic']">
          حدث خطأ غير متوقع
        </h2>
        <p className="text-gray-600 mb-6 font-['IBM_Plex_Sans_Arabic']">
          نعتذر عن هذا الخطأ. يرجى المحاولة مرة أخرى أو العودة للصفحة الرئيسية.
        </p>
        <div className="space-y-4">
          <button
            onClick={() => reset()}
            className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 font-['IBM_Plex_Sans_Arabic']"
          >
            المحاولة مرة أخرى
          </button>
          <Link
            href="/"
            className="block w-full px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200 font-['IBM_Plex_Sans_Arabic'] text-center"
          >
            العودة للرئيسية
          </Link>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-8 text-left">
            <summary className="cursor-pointer text-gray-500 font-mono text-sm">
              Error Details (Development)
            </summary>
            <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto">
              {error.message}
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}
