"use client"

import Link from "next/link"
import { useState } from "react"
import { StrapiImage } from "@/components/custom/strapi-image"
import type { CategoryPageData } from "./type"
import type { Article } from "@/lib/types"

interface CategoryPageProps {
  data: CategoryPageData
}

type ArticleWithExtras = Article & {
  description?: string;
  author?: { name: string } | null;
}

// Dynamic Category Header Component (removed from main component)
interface CategoryHeaderProps {
  category: {
    name: string
    description?: string
    children_categories?: Array<{
      id: string
      name: string
      slug: string
    }>
  }
}

function CategoryHeader({ category }: CategoryHeaderProps) {
  return (
    <div className="bg-white" dir="rtl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="py-4 text-sm text-gray-500 border-b border-gray-100">
          <Link href="/" className="hover:text-black font-medium">
            الرئيسية
          </Link>
          <span className="mx-2">/</span>
          <span className="text-black font-semibold">{category.name}</span>
        </nav>

        {/* Category Title Section */}
        <div className="py-8 md:py-12 text-center">
          <h1 className="font-bold text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] uppercase tracking-[3px] sm:tracking-[4px] md:tracking-[5px] lg:tracking-[6px] text-black mb-4 leading-none">
            {category.name}
          </h1>
          
          {category.description && (
            <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
              {category.description}
            </p>
          )}

          {/* Dynamic Sub-categories Navigation */}
          {category.children_categories && category.children_categories.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 md:gap-3 mt-8">
              {category.children_categories.map((child) => (
                <Link
                  key={child.slug}
                  href={`/${child.slug}`}
                  className="px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-900 hover:text-white hover:border-gray-900 uppercase tracking-wide"
                >
                  {child.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function CategoryPage({ data }: CategoryPageProps) {
  const { category, mainArticle, sideArticles, bottomImages, latestNews } = data

  // Enhanced helper function to get image URL from backend
  const getImageUrl = (imageData: any): string => {
    if (!imageData) return '/placeholder-article.jpg'
    
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

    if (!url) return '/placeholder-article.jpg'

    return url.startsWith('/') 
      ? `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${url}`
      : url
  }

  // Image component with fallback
  const ImageWithFallback = ({ src, alt, className, ...props }: any) => {
    const [imgSrc, setImgSrc] = useState(src)
    
    const handleError = () => {
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

    return (
      <img
        src={imgSrc}
        alt={alt}
        className={className}
        onError={handleError}
        {...props}
      />
    )
  }

  if (!mainArticle) {
    return (
      <div className="bg-white min-h-screen" dir="rtl">
        {/* <CategoryHeader category={category} /> */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-16">
            <div className="text-6xl mb-6">📄</div>
            <h2 className="text-2xl font-bold text-black mb-4">لا توجد مقالات في هذا القسم</h2>
            <p className="text-gray-600">تحقق مرة أخرى لاحقاً للحصول على المحتوى الجديد</p>
          </div>
        </div>
      </div>
    )
  }

  const main = mainArticle as ArticleWithExtras

  return (
    <div className="bg-white min-h-screen" dir="rtl">
      {/* Dynamic Category Header */}
     {/* <CategoryHeader category={{
        ...category,
        children_categories: category.children_categories?.map(child => ({
          id: String(child.id),
          name: child.name,
          slug: child.slug,
        })),
      }} /> */}

      {/* Main Content Grid - Fast Company Style */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          
          {/* Left - Main Featured Article */}
          <div className="lg:col-span-5 mb-8 lg:mb-0">
            <Link href={`/articles/${mainArticle.slug}`} className="group">
              <div className="relative w-full h-[220px] sm:h-[280px] md:h-[360px] mb-3 sm:mb-4 bg-gray-100">
                <ImageWithFallback
                  src={getImageUrl(mainArticle.cover_image)}
                  alt={mainArticle.cover_image?.alternativeText || mainArticle.title}
                  style={{
                    position: 'absolute',
                    height: '100%',
                    width: '100%',
                    left: 0,
                    top: 0,
                    right: 0,
                    bottom: 0,
                    color: 'transparent'
                  }}
                  className="object-cover"
                />
              </div>
              <h2 className="font-bold text-black text-[18px] sm:text-[22px] md:text-[26px] leading-[20px] sm:leading-[24px] md:leading-[28px] mb-3 sm:mb-4 group-hover:text-gray-600">
                {mainArticle.title}
              </h2>
            </Link>
            {main.description && (
              <p className="text-gray-600 text-[14px] sm:text-[15px] leading-[17px] sm:leading-[18px]">
                {main.description}
              </p>
            )}
          </div>

          {/* Right - Grid of Articles and Images */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              
              {/* Top Row Articles */}
              {sideArticles.slice(0, 2).map((article) => {
                const sideArticle = article as ArticleWithExtras
                return (
                  <div key={article.id} className="mb-4 sm:mb-6">
                    <Link href={`/articles/${article.slug}`} className="group">
                      <div className="relative w-full h-[160px] sm:h-[180px] md:h-[200px] mb-2 sm:mb-3 bg-gray-100">
                        <ImageWithFallback
                          src={getImageUrl(article.cover_image)}
                          alt={article.cover_image?.alternativeText || article.title}
                          style={{
                            position: 'absolute',
                            height: '100%',
                            width: '100%',
                            left: 0,
                            top: 0,
                            right: 0,
                            bottom: 0,
                            color: 'transparent'
                          }}
                          className="object-cover"
                        />
                      </div>
                      <h3 className="font-bold text-black text-[14px] sm:text-[16px] md:text-[18px] leading-[16px] sm:leading-[18px] md:leading-[20px] mb-2 group-hover:text-gray-600">
                        {article.title}
                      </h3>
                    </Link>
                    {sideArticle.description && (
                      <p className="text-gray-600 text-[12px] sm:text-[13px] leading-[15px] sm:leading-[16px]">
                        {sideArticle.description}
                      </p>
                    )}
                  </div>
                )
              })}

              {/* Bottom Row Images */}
              {bottomImages.slice(0, 2).map((image) => (
                <Link key={image.id} href={`/articles/${image.slug}`} className="group">
                  <div className="relative w-full h-[120px] sm:h-[140px] md:h-[160px] bg-gray-100">
                    <ImageWithFallback
                      src={getImageUrl(image.cover_image)}
                      alt={image.cover_image?.alternativeText || image.title}
                      style={{
                        position: 'absolute',
                        height: '100%',
                        width: '100%',
                        left: 0,
                        top: 0,
                        right: 0,
                        bottom: 0,
                        color: 'transparent'
                      }}
                      className="object-cover"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Latest News Section - Fast Company Style */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200">
          <h2 className="font-bold text-[20px] sm:text-[24px] uppercase leading-[18px] sm:leading-[22px] tracking-[2px] sm:tracking-[3px] md:text-[38px] md:leading-[32px] md:tracking-[5px] text-black text-left mb-6 sm:mb-8">
            {latestNews.title}
          </h2>

          <div className="space-y-6 sm:space-y-8 md:space-y-10">
            {latestNews.items.map((news) => {
              const newsArticle = news as ArticleWithExtras
              return (
                <article key={news.id} className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 items-start">
                  {/* Content - Left side */}
                  <div className="lg:col-span-2 lg:order-1 order-2">
                    {news.category && (
                      <div className="text-[9px] sm:text-[10px] md:text-[11px] text-gray-500 uppercase tracking-wide mb-2 sm:mb-3 font-medium">
                        {news.category.name}
                      </div>
                    )}

                    <Link href={`/articles/${news.slug}`} className="group">
                      <h3 className="font-bold text-black text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] leading-[18px] sm:leading-[20px] md:leading-[22px] lg:leading-[24px] mb-3 sm:mb-4 group-hover:text-gray-600">
                        {news.title}
                      </h3>
                    </Link>

                    {newsArticle.description && (
                      <p className="text-gray-600 text-[13px] sm:text-[14px] leading-[16px] sm:leading-[17px]">
                        {newsArticle.description}
                      </p>
                    )}
                  </div>

                  {/* Image - Right side */}
                  <div className="lg:col-span-1 lg:order-2 order-1 mb-4 lg:mb-0">
                    <Link href={`/articles/${news.slug}`} className="group">
                      <div className="relative w-full h-[140px] sm:h-[160px] md:h-[180px] mx-auto lg:ml-auto lg:mr-0 max-w-[320px] lg:max-w-[280px] bg-gray-100">
                        <ImageWithFallback
                          src={getImageUrl(news.cover_image)}
                          alt={news.cover_image?.alternativeText || news.title}
                          style={{
                            position: 'absolute',
                            height: '100%',
                            width: '100%',
                            left: 0,
                            top: 0,
                            right: 0,
                            bottom: 0,
                            color: 'transparent'
                          }}
                          className="object-cover"
                        />
                      </div>
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>
        </div>

        {/* Load More Button */}
        {/* <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <button className="px-8 py-3 border-2 border-gray-900 text-gray-900 font-bold hover:bg-gray-900 hover:text-white uppercase tracking-wide text-sm">
            تحميل المزيد
          </button>
        </div> */}

      </div>
    </div>
  )
}

// Export the reusable header component for use in other pages (separate file)
// You can use this in your separate header file