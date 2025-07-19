"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { getAllMagazineIssues } from "@/lib/strapi-client"

interface Magazine {
  id: string
  documentId: string
  title: string
  slug: string
  issue_number: number
  publish_date: string
  is_featured: boolean
  cover_image: {
    id: number
    documentId: string
    url: string
    alternativeText: string | null
    width: number
    height: number
  } | null
  pdf_attachment?: {
    id: number
    documentId: string
    name: string
    url: string
  } | null
}

export function MagazineList() {
  const [magazines, setMagazines] = useState<Magazine[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMagazines() {
      try {
        const response = await getAllMagazineIssues()
        if (response && response.data) {
          const transformedMagazines: Magazine[] = response.data.map((item: any) => ({
            id: item.id,
            documentId: item.documentId,
            title: item.title,
            slug: item.slug,
            issue_number: item.issue_number,
            publish_date: item.publish_date,
            is_featured: item.is_featured,
            cover_image: item.cover_image,
            pdf_attachment: item.pdf_attachment,
          }))
          setMagazines(transformedMagazines)
        }
      } catch (err) {
        console.error("Failed to fetch magazines:", err)
        setError("فشل في تحميل المجلات")
      } finally {
        setLoading(false)
      }
    }

    fetchMagazines()
  }, [])

  // Enhanced helper function to get image URL from backend
  const getImageUrl = (imageData: any): string => {
    if (!imageData) return '/placeholder-magazine.jpg'
    
    let url = ''
    if (typeof imageData === 'string') {
      url = imageData
    } else if (imageData.url) {
      url = imageData.url
    } else if (imageData.data && imageData.data.attributes) {
      url = imageData.data.attributes.url
    } else if (imageData.data && imageData.data.url) {
      url = imageData.data.url
    }

    if (!url) return '/placeholder-magazine.jpg'

    return url.startsWith('/') 
      ? `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${url}`
      : url
  }

  // Image component with fallback
  const ImageWithFallback = ({ src, alt, className, ...props }: any) => {
    const [imgSrc, setImgSrc] = useState(src)
    
    const handleError = () => {
      // Magazine-themed placeholder images
      const placeholderImages = [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&auto=format&q=80',
        'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=500&fit=crop&auto=format&q=80',
        'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=500&fit=crop&auto=format&q=80'
      ]
      const randomIndex = Math.floor(Math.random() * placeholderImages.length)
      setImgSrc(placeholderImages[randomIndex])
    }

    return (
      <Image
        src={imgSrc}
        alt={alt}
        className={className}
        onError={handleError}
        {...props}
      />
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-orange-400 border-t-transparent animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-orange-400 text-white font-medium hover:bg-orange-500"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    )
  }

  // Get featured magazine for hero section
  const featuredMagazine = magazines.find(mag => mag.is_featured) || magazines[0]

  return (
    <div className="bg-white min-h-screen" dir="rtl">
      {/* Hero Section with Featured Magazine Cover */}
      {featuredMagazine && (
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              {/* Magazine Cover */}
              <div className="order-2 lg:order-1 flex justify-center">
                <div className="relative">
                  <div className="w-80 h-96 relative bg-gray-100 shadow-2xl">
                    <ImageWithFallback
                      src={getImageUrl(featuredMagazine.cover_image)}
                      alt={featuredMagazine.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  {/* Featured Badge */}
                  <div className="absolute -top-3 -right-3 bg-orange-400 text-white px-3 py-1 text-xs font-bold uppercase tracking-wide">
                    العدد الجديد
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="order-1 lg:order-2 text-center lg:text-right">
                <h1 className="font-bold text-5xl md:text-6xl lg:text-7xl text-black mb-6 leading-none">
                  المجلة
                </h1>
                
                <div className="mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    {featuredMagazine.title}
                  </h2>
                  <p className="text-gray-600 text-lg">
                    العدد {featuredMagazine.issue_number} - {new Date(featuredMagazine.publish_date).toLocaleDateString("ar-SA", {
                      year: "numeric",
                      month: "long",
                    })}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link
                    href={`/magazine/${featuredMagazine.slug}`}
                    className="bg-orange-400 text-white px-8 py-3 font-bold hover:bg-orange-500 uppercase tracking-wide text-sm"
                  >
                    قراءة العدد
                  </Link>
                  
                  {featuredMagazine.pdf_attachment && (
                    <a
                      href={getImageUrl(featuredMagazine.pdf_attachment)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border-2 border-gray-900 text-gray-900 px-8 py-3 font-bold hover:bg-gray-900 hover:text-white uppercase tracking-wide text-sm"
                    >
                      تحميل PDF
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All Issues Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-8 bg-orange-400"></div>
            <h2 className="text-2xl font-bold text-gray-900">جميع الأعداد</h2>
          </div>
          <p className="text-gray-600">تصفح مجموعة أعدادنا المتنوعة</p>
        </div>

        {/* Magazine Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {magazines.map((magazine) => {
            const imageUrl = getImageUrl(magazine.cover_image)

            return (
              <article key={magazine.id} className="group">
                <Link href={`/magazine/${magazine.slug}`}>
                  <div className="relative mb-4 overflow-hidden bg-gray-100">
                    <div className="aspect-[3/4] relative">
                      <ImageWithFallback
                        src={imageUrl}
                        alt={magazine.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {magazine.is_featured && (
                      <div className="absolute top-3 right-3 bg-orange-400 text-white px-2 py-1 text-xs font-bold uppercase tracking-wide">
                        مميز
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm text-gray-500">
                      العدد {magazine.issue_number}
                    </div>

                    <h3 className="font-bold text-lg text-black leading-tight">
                      {magazine.title}
                    </h3>

                    <time className="text-sm text-gray-500">
                      {new Date(magazine.publish_date).toLocaleDateString("ar-SA", {
                        year: "numeric",
                        month: "long",
                      })}
                    </time>
                  </div>
                </Link>
              </article>
            )
          })}
        </div>

        {/* Empty State */}
        {magazines.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-6">📖</div>
            <h2 className="text-2xl font-bold text-black mb-4">لا توجد أعداد متاحة حالياً</h2>
            <p className="text-gray-600">تحقق مرة أخرى لاحقاً للحصول على أحدث الأعداد</p>
          </div>
        )}
      </div>

      {/* Newsletter Section */}
      <div className="bg-gray-50 border-t border-gray-100 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="font-bold text-2xl text-black mb-4">ابق على اطلاع دائم</h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            احصل على آخر الأعداد والمحتوى الحصري مباشرة في بريدك الإلكتروني
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              className="flex-1 px-4 py-3 border border-gray-300 text-right focus:outline-none focus:border-orange-400"
            />
            <button className="px-6 py-3 bg-orange-400 text-white font-medium hover:bg-orange-500 uppercase tracking-wide text-sm">
              اشتراك
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}