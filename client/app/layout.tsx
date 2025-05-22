import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Link from "next/link"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Next.js 15 Blog",
  description: "A simple blog built with Next.js 15",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold text-center">
              <Link href="/" className="text-blue-600 hover:text-blue-800">
                Next.js and Strapi Preview Example
              </Link>
            </h1>
          </div>
        </header>
        {children}
        <footer className="bg-gray-50 mt-12">
          <div className="container mx-auto px-4 py-8">
            <p className="text-center text-gray-500">
              © {new Date().getFullYear()} Next.js 15 Blog. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
