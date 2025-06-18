import type React from "react"
import type { Metadata } from "next"
import { IBM_Plex_Sans_Arabic, Noto_Sans_Arabic, Tajawal } from "next/font/google"
import "./globals.css"
import Link from "next/link"

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans-arabic",
})

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans-arabic",
})

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  variable: "--font-tajawal",
})

export const metadata: Metadata = {
  title: {
    default: 'شروع - مجلة رقمية للابتكار وريادة الأعمال',
    template: '%s | شروع',
  },
  description: 'منصة إعلامية عربية متخصصة في الابتكار وريادة الأعمال والقيادة والتحول الرقمي والتقنيات الناشئة',
  keywords: [
    'ريادة الأعمال',
    'الابتكار',
    'القيادة',
    'التحول الرقمي',
    'التقنيات الناشئة',
    'الشركات الناشئة',
    'الاستثمار',
    'التطوير',
  ],
  authors: [{ name: 'شروع للنشر الرقمي' }],
  creator: 'شروع للنشر الرقمي',
  publisher: 'شروع للنشر الرقمي'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" suppressHydrationWarning dir="rtl" className={`${ibmPlexSansArabic.variable} ${notoSansArabic.variable} ${tajawal.variable}`}>
      <body className="font-sans" suppressHydrationWarning>
        {/* <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold text-center">
              <Link href="/" className="text-blue-600 hover:text-blue-800">
                شروع
              </Link>
            </h1>
          </div>
        </header> */}
        {children}
        {/* <footer className="bg-gray-50 mt-12">
          <div className="container mx-auto px-4 py-8">
            <p className="text-center text-gray-600">
            © {new Date().getFullYear()} شروع. جميع الحقوق محفوظة
            </p>
          </div>
        </footer> */}
      </body>
    </html>
  )
}
