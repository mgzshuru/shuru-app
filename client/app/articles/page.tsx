// app/articles/page.tsx
'use client'
import { getAllArticles } from "@/lib/strapi-client"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"

// Helper function to format date safely
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch (error) {
    return dateString
  }
}

interface Article {
  id: string
  documentId: string
  title: string
  slug: string
  description: string
  publish_date: string
  is_featured?: boolean
  cover_image?: {
    id: number
    documentId: string
    url: string
    alternativeText: string | null
    width: number
    height: number
  } | null
  author?: {
    id: number
    documentId: string
    name: string
    jobTitle?: string
  } | null
  category?: {
    id: number
    documentId: string
    name: string
    slug: string
  } | null
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log('🚀 Fetching articles...')
        const response = await getAllArticles()
        console.log('📚 Articles response:', response)

        if (response && response.data) {
          // Transform the data to match Strapi v5 structure
          const transformedArticles: Article[] = response.data.map((item: any) => ({
            id: item.id,
            documentId: item.documentId,
            title: item.title,
            slug: item.slug,
            description: item.description,
            publish_date: item.publish_date,
            is_featured: item.is_featured,
            cover_image: item.cover_image, // ✅ Enable cover_image
            author: item.author,
            category: item.category
          }))
          
          console.log('🖼️ Transformed articles with images:', transformedArticles)
          setArticles(transformedArticles)
        } else {
          setError("No articles found")
        }
      } catch (err) {
        console.error("💥 Failed to fetch articles:", err)
        setError(`Failed to load articles: ${err instanceof Error ? err.message : String(err)}`)
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [])

  // Enhanced helper function to get image URL for Strapi v5
  const getImageUrl = (imageData: any): string => {
    console.log('🖼️ Processing image data:', imageData)
    
    if (!imageData) {
      console.log('⚠️ No image data provided')
      return '/placeholder-article.jpg'
    }

    // Handle different possible image data structures
    let url = ''
    
    if (typeof imageData === 'string') {
      url = imageData
    } else if (imageData.url) {
      url = imageData.url
    } else if (imageData.data && imageData.data.attributes) {
      // Strapi v4 format
      url = imageData.data.attributes.url
    } else if (imageData.data && imageData.data.url) {
      // Alternative format
      url = imageData.data.url
    }

    if (!url) {
      console.log('⚠️ No URL found in image data')
      return '/placeholder-article.jpg'
    }

    // Construct full URL if needed
    const fullUrl = url.startsWith('/') 
      ? `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${url}`
      : url

    console.log('🎯 Final image URL:', fullUrl)
    return fullUrl
  }

  // Fallback image component
  const ImageWithFallback = ({ src, alt, className, ...props }: any) => {
    const [imgSrc, setImgSrc] = useState(src)
    const [hasError, setHasError] = useState(false)

    const handleError = () => {
      if (!hasError) {
        console.log('❌ Image failed to load:', src)
        setHasError(true)
        
        // Use business-related placeholder images
        const placeholderImages = [
          'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop&auto=format&q=80',
          'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop&auto=format&q=80',
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&auto=format&q=80',
          'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop&auto=format&q=80',
          'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop&auto=format&q=80'
        ]
        
        const randomIndex = Math.floor(Math.random() * placeholderImages.length)
        setImgSrc(placeholderImages[randomIndex])
      }
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
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل المقالات...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">خطأ في تحميل المقالات</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-orange-400 text-white px-6 py-3 hover:bg-orange-500 transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Header - Fast Company Style */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-12 text-center">
            <div className="mb-6">
              <span className="inline-block bg-orange-400 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider">
                IDEAS
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight leading-tight">
              الأفكار المؤثرة
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              اكتشف الأفكار التي تشكل مستقبل الأعمال والتكنولوجيا
            </p>
          </div>
        </div>
      </div>

      {/* Featured Section */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-orange-400"></div>
            <h2 className="text-lg font-black text-gray-900 uppercase tracking-wide">المميز</h2>
          </div>
          
          {articles.filter(article => article.is_featured).length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {articles.filter(article => article.is_featured).slice(0, 3).map((article) => {
                const imageUrl = getImageUrl(article.cover_image)
                const categoryName = article.category?.name
                const authorName = article.author?.name

                return (
                  <article key={article.id} className="group">
                    <Link href={`/articles/${article.slug}`}>
                      <div className="relative mb-4 overflow-hidden bg-gray-900 rounded-lg">
                        <div className="aspect-[3/2] relative">
                          <ImageWithFallback
                            src={imageUrl}
                            alt={article.cover_image?.alternativeText || article.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        </div>
                        <div className="absolute top-3 right-3 bg-orange-500 text-white px-2 py-1 text-xs font-bold uppercase tracking-wider">
                          مميز
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {categoryName && (
                          <span className="text-orange-400 text-xs font-bold uppercase tracking-wide">
                            {categoryName}
                          </span>
                        )}
                        <h3 className="text-lg font-bold text-gray-900 leading-tight">
                          {article.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                          {article.description}
                        </p>
                        {authorName && (
                          <p className="text-xs text-gray-500 uppercase tracking-wide">
                            بقلم {authorName}
                          </p>
                        )}
                      </div>
                    </Link>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Articles Grid */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-6 bg-gray-900"></div>
            <h2 className="text-lg font-black text-gray-900 uppercase tracking-wide">جميع المقالات</h2>
          </div>
          
          {articles.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📄</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">لا توجد مقالات متاحة</h3>
              <p className="text-gray-600">تحقق من إعدادات المحتوى في Strapi</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => {
                const imageUrl = getImageUrl(article.cover_image)
                const categoryName = article.category?.name
                const authorName = article.author?.name

                return (
                  <article key={article.id} className="group">
                    <Link href={`/articles/${article.slug}`}>
                      <div>
                        {/* Article Image */}
                        <div className="relative mb-4 overflow-hidden bg-gray-100">
                          <div className="aspect-[3/2] relative">
                            <ImageWithFallback
                              src={imageUrl}
                              alt={article.cover_image?.alternativeText || article.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          </div>
                          
                          {/* Category Badge on Image */}
                          {categoryName && (
                            <div className="absolute top-3 right-3 bg-gray-900 text-white px-2 py-1 text-xs font-bold uppercase tracking-wide">
                              {categoryName}
                            </div>
                          )}
                        </div>

                        {/* Article Content */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 text-xs">
                            <span className="text-gray-500 uppercase tracking-wide">
                              {formatDate(article.publish_date)}
                            </span>
                          </div>
                          
                          <h3 className="text-lg font-bold text-gray-900 leading-tight">
                            {article.title}
                          </h3>
                          
                          <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                            {article.description}
                          </p>

                          {authorName && (
                            <div className="flex items-center gap-2 pt-2 text-xs text-gray-500">
                              <span>بقلم</span>
                              <span className="font-semibold">{authorName}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  </article>
                )
              })}
            </div>
          )}

          {/* Load More Button */}
          {articles.length > 0 && (
            <div className="text-center mt-12">
              <button className="bg-white text-gray-900 border-2 border-gray-900 px-8 py-3 font-bold hover:bg-gray-900 hover:text-white uppercase tracking-wide">
                المزيد من المقالات
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="mb-8">
            <span className="inline-block bg-orange-400 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider mb-4">
              NEWSLETTER
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            انضم إلى مجتمع الرواد
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            احصل على آخر الأفكار والاتجاهات في عالم الأعمال والتكنولوجيا
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              className="flex-1 px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-orange-400 text-right"
            />
            <button className="bg-orange-500 text-white px-6 py-3 font-bold hover:bg-orange-600 transition-colors uppercase tracking-wide">
              اشتراك
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}