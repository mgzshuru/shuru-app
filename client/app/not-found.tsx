"use client"

import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4" 
         style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
      <h2 className="text-4xl font-bold mb-4" 
          style={{ color: '#CBD1F9' }}>
        404 - الصفحة غير موجودة
      </h2>
      <Link 
        href="/" 
        className="px-6 py-3 rounded-none transition-colors font-medium"
        style={{ 
          backgroundColor: '#808080',
          color: '#FFFFFF'
        }}
        onMouseEnter={(e) => {
          (e.target as HTMLElement).style.backgroundColor = '#A9A9A9';
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLElement).style.backgroundColor = '#808080';
        }}
      >
        العودة للرئيسية
      </Link>
    </div>
  )
}