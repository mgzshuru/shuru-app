"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Download, Eye, ArrowRight } from "lucide-react"
import { getMagazineIssueBySlug } from "@/lib/strapi-client"

interface MagazineDetails {
  id: string
  documentId: string
  title: string
  slug: string
  issue_number: number
  description: string
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
  articles?: Array<{
    id: string
    title: string
    slug: string
    description: string
    publish_date: string
    is_featured: boolean
    cover_image: {
      id: number
      url: string
      alternativeText: string | null
    } | null
    author: {
      name: string
    } | null
  }>
}

interface MagazineDetailProps {
  slug: string
}

export function MagazineDetail({ slug }: MagazineDetailProps) {
  const [magazine, setMagazine] = useState<MagazineDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMagazine() {
      try {
        const response = await getMagazineIssueBySlug(slug)
        console.log(response , "Response load")
        if (response) {
          setMagazine(response as MagazineDetails)
        } else {
          setError("المجلة غير موجودة")
        }
      } catch (err) {
        console.error("Failed to fetch magazine:", err)
        setError("فشل في تحميل المجلة")
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchMagazine()
    }
  }, [slug])

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
      const placeholderImages = [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&auto=format&q=80',
        'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=600&fit=crop&auto=format&q=80',
        'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop&auto=format&q=80'
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
          <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل المجلة...</p>
        </div>
      </div>
    )
  }

  if (error || !magazine) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6">📖</div>
          <h2 className="text-2xl font-bold text-black mb-4">المجلة غير موجودة</h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <Link
            href="/magazine"
            className="inline-flex items-center px-6 py-3 bg-gray-900 text-white font-medium hover:bg-gray-800"
          >
            العودة إلى المجلة
          </Link>
        </div>
      </div>
    )
  }

  const imageUrl = getImageUrl(magazine.cover_image)
  const pdfUrl = magazine.pdf_attachment ? getImageUrl(magazine.pdf_attachment) : null

  return (
    <div className="bg-white min-h-screen" dir="rtl">
      {/* Header Navigation */}
      <div className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <nav className="flex items-center text-sm">
            <Link href="/" className="text-gray-500 hover:text-black font-medium">
              الرئيسية
            </Link>
            <span className="mx-2 text-gray-300">/</span>
            <Link href="/magazine" className="text-gray-500 hover:text-black font-medium">
              المجلة
            </Link>
            <span className="mx-2 text-gray-300">/</span>
            <span className="text-black font-semibold">العدد {magazine.issue_number}</span>
          </nav>
        </div>
      </div>

      {/* Magazine Title */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 md:py-6">
        <h1 className="font-bold text-[24px] sm:text-[28px] uppercase leading-[22px] sm:leading-[26px] tracking-[2.4px] sm:tracking-[3.6px] md:text-[45px] md:leading-[38px] md:tracking-[6px] text-black text-center mb-4 md:mb-6">
          {magazine.title}
        </h1>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          
          {/* Left - Magazine Cover */}
          <div className="lg:col-span-5 mb-8 lg:mb-0">
            <div className="relative w-full h-[280px] sm:h-[360px] md:h-[460px] mb-3 sm:mb-4">
              <ImageWithFallback
                src={imageUrl}
                alt={magazine.title}
                fill
                className="object-cover"
              />
              
              {/* Issue Badge */}
              <div className="absolute top-4 right-4 bg-gray-900 text-white px-3 py-1 text-xs font-bold uppercase tracking-wide">
                العدد {magazine.issue_number}
              </div>
              
              {magazine.is_featured && (
                <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 text-xs font-bold uppercase tracking-wide">
                  مميز
                </div>
              )}
            </div>
            
            {/* Magazine Info */}
            <div className="mb-4">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                {new Date(magazine.publish_date).toLocaleDateString("ar-SA", {
                  year: "numeric",
                  month: "long",
                })}
              </div>
              <h2 className="font-bold text-black text-[18px] sm:text-[22px] md:text-[26px] leading-[20px] sm:leading-[24px] md:leading-[28px] mb-3 sm:mb-4">
                {magazine.title}
              </h2>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {pdfUrl && (
                <a
                  href={pdfUrl}
                  download={magazine.pdf_attachment?.name || "magazine.pdf"}
                  className="flex items-center justify-center w-full bg-gray-900 text-white py-3 px-6 font-medium hover:bg-gray-800 text-sm uppercase tracking-wide"
                >
                  <Download size={16} className="ml-2" />
                  تحميل PDF
                </a>
              )}

              <button className="flex items-center justify-center w-full border-2 border-gray-900 text-gray-900 py-3 px-6 font-medium hover:bg-gray-900 hover:text-white text-sm uppercase tracking-wide">
                <Eye size={16} className="ml-2" />
                قراءة أونلاين
              </button>
            </div>
          </div>

          {/* Right - Articles Grid */}
          <div className="lg:col-span-7">
            {magazine.articles && magazine.articles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {magazine.articles.map((article, index) => (
                  <div key={article.id} className="mb-4 sm:mb-6">
                    <Link href={`/articles/${article.slug}`}>
                      <div className="relative w-full h-[160px] sm:h-[180px] md:h-[200px] mb-2 sm:mb-3">
                        <ImageWithFallback
                          src={getImageUrl(article.cover_image)}
                          alt={article.title}
                          fill
                          className="object-cover"
                        />
                        
                        {article.is_featured && (
                          <div className="absolute top-3 right-3 bg-gray-900 text-white px-2 py-1 text-xs font-bold uppercase tracking-wide">
                            مميز
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-xs text-gray-500 uppercase tracking-wide">
                          {article.author?.name && `بقلم ${article.author.name}`}
                        </div>
                        <h3 className="font-bold text-black text-[14px] sm:text-[16px] md:text-[18px] leading-[16px] sm:leading-[18px] md:leading-[20px] mb-2 hover:text-gray-600">
                          {article.title}
                        </h3>
                        
                        {/* Article Description */}
                        {article.description && (
                          <p className="text-gray-600 text-[12px] sm:text-[13px] leading-[15px] sm:leading-[16px] mb-2 line-clamp-3">
                            {article.description.replace(/<[^>]*>/g, "")}
                          </p>
                        )}
                        <div className="text-xs text-gray-500">
                          {new Date(article.publish_date).toLocaleDateString("ar-SA", {
                            month: "long",
                            day: "numeric",
                          })}
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-4xl mb-4">📄</div>
                <p className="text-gray-600">لا توجد مقالات في هذا العدد</p>
              </div>
            )}
          </div>
        </div>

        {/* Description Section */}
        {magazine.description && (
          <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200">
            <h2 className="font-bold text-[20px] sm:text-[24px] uppercase leading-[18px] sm:leading-[22px] tracking-[2px] sm:tracking-[3px] md:text-[38px] md:leading-[32px] md:tracking-[5px] text-black mb-6 sm:mb-8">
              نبذة عن العدد
            </h2>
            
            <div className="prose max-w-none">
              <div
                className="text-gray-700 text-[13px] sm:text-[14px] leading-[16px] sm:leading-[17px]"
                dangerouslySetInnerHTML={{ __html: magazine.description }}
              />
            </div>
          </div>
        )}

        {/* All Articles List */}
        {magazine.articles && magazine.articles.length > 0 && (
          <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200">
            <h2 className="font-bold text-[20px] sm:text-[24px] uppercase leading-[18px] sm:leading-[22px] tracking-[2px] sm:tracking-[3px] md:text-[38px] md:leading-[32px] md:tracking-[5px] text-black mb-6 sm:mb-8">
              المقالات في هذا العدد
            </h2>

            <div className="space-y-6 sm:space-y-8 md:space-y-10">
              {magazine.articles.map((article, index) => (
                <div key={article.id} className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 items-start">
                  <div className="lg:col-span-2 lg:order-1 order-2">
                    <div className="text-[9px] sm:text-[10px] md:text-[11px] text-gray-500 uppercase tracking-wide mb-2 sm:mb-3 font-medium">
                      {article.author?.name && `بقلم ${article.author.name}`}
                    </div>
                    <Link href={`/articles/${article.slug}`}>
                      <h3 className="font-bold text-black text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] leading-[18px] sm:leading-[20px] md:leading-[22px] lg:leading-[24px] mb-3 sm:mb-4 hover:text-gray-600">
                        {article.title}
                      </h3>
                    </Link>
                    
                    {/* Article Description */}
                    {article.description && (
                      <p className="text-gray-600 text-[13px] sm:text-[14px] leading-[16px] sm:leading-[17px] mb-3">
                        {article.description.replace(/<[^>]*>/g, "")}
                      </p>
                    )}
                    <div className="text-[11px] sm:text-[12px] text-gray-500 flex items-center gap-2">
                      <time>
                        {new Date(article.publish_date).toLocaleDateString("ar-SA", {
                          month: "long",
                          day: "numeric",
                        })}
                      </time>
                      {article.is_featured && (
                        <>
                          <span>•</span>
                          <span className="text-gray-700 font-medium">مميز</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="lg:col-span-1 lg:order-2 order-1 mb-4 lg:mb-0">
                    <Link href={`/articles/${article.slug}`}>
                      <div className="relative w-full h-[140px] sm:h-[160px] md:h-[180px] mx-auto lg:ml-auto lg:mr-0 max-w-[320px] lg:max-w-[280px]">
                        <ImageWithFallback
                          src={getImageUrl(article.cover_image)}
                          alt={article.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Newsletter Section */}
      <div className="bg-gray-50 border-t border-gray-100 mt-16 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="font-bold text-2xl text-black mb-4">لا تفوت الأعداد القادمة</h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            اشترك في قائمتنا البريدية لتحصل على إشعار فور صدور العدد الجديد
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              className="flex-1 px-4 py-3 border border-gray-300 text-right focus:outline-none focus:border-gray-900"
            />
            <button className="px-6 py-3 bg-gray-900 text-white font-medium hover:bg-gray-800 uppercase tracking-wide text-sm">
              اشتراك
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}