import Image from "next/image"
import Link from "next/link"
import { Twitter, Facebook, Linkedin, Share2, Clock, User } from "lucide-react"
import { ContentRenderer, type ContentBlockTypes } from "@/components/blocks/content/ContentRenderer"
import { StrapiImage, getStrapiMedia } from "@/components/custom/strapi-image" // Import your utility

import type { Article, Block } from "@/lib/types"

interface ArticleDetailProps {
  article: Article | null | undefined
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

  if (diffInHours < 1) return "منذ دقائق"
  if (diffInHours < 24) return `منذ ${diffInHours} ساعة`
  if (diffInHours < 48) return "منذ يوم"
  return formatDate(dateString)
}

function transformBlocksForRenderer(blocks: Block[]): ContentBlockTypes[] {
  return blocks.map(block => {
    if (block.__component === 'content.image') {
      return {
        ...block,
        image: {
          ...block.image,
          width: Math.min(block.image.width ?? 600, 600),
          height: Math.min(block.image.height ?? 400, 400),
        }
      } as ContentBlockTypes;
    }
    
    if (block.__component === 'content.gallery') {
      return {
        ...block,
        images: block.images.map(img => ({
          ...img,
          width: Math.min(img.width ?? 300, 300),
          height: Math.min(img.height ?? 200, 200),
        }))
      } as ContentBlockTypes;
    }
    
    if (block.__component === 'content.video-embed' && block.thumbnail) {
      return {
        ...block,
        thumbnail: {
          ...block.thumbnail,
          width: Math.min(block.thumbnail.width ?? 600, 600),
          height: Math.min(block.thumbnail.height ?? 340, 340),
        }
      } as ContentBlockTypes;
    }
    
    return block as ContentBlockTypes;
  });
}

export function ArticleDetail({ article }: ArticleDetailProps) {
  if (!article) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center" dir="rtl">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-6">📄</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">المقال غير موجود</h1>
          <p className="text-gray-600 mb-8 leading-relaxed">عذراً، لم نتمكن من العثور على المقال المطلوب.</p>
          <Link 
            href="/" 
            className="inline-block px-8 py-3 bg-black text-white font-semibold hover:bg-gray-800 transition-colors"
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    );
  }

  if (!article.title) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center" dir="rtl">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-6">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">خطأ في تحميل المقال</h1>
          <p className="text-gray-600 mb-8 leading-relaxed">حدث خطأ أثناء تحميل بيانات المقال.</p>
          <Link 
            href="/" 
            className="inline-block px-8 py-3 bg-black text-white font-semibold hover:bg-gray-800 transition-colors"
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="bg-white min-h-screen" dir="rtl">
      {/* Header Navigation */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <nav className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-gray-500 hover:text-black transition-colors font-medium">
                الرئيسية
              </Link>
              <span className="text-gray-300">/</span>
              {article.category && (
                <>
                  <Link
                    href={`/${article.category.slug}`}
                    className="text-gray-500 hover:text-black transition-colors font-medium"
                  >
                    {article.category.name}
                  </Link>
                  <span className="text-gray-300">/</span>
                </>
              )}
              <span className="text-black font-semibold">المقال</span>
            </nav>
            
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-400 hover:text-black transition-colors">
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Article Header */}
      <header className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
          {/* Category Badge */}
          {article.category && (
            <div className="mb-6">
              <Link
                href={`/${article.category.slug}`}
                className="inline-block bg-black text-white px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors"
              >
                {article.category.name}
              </Link>
            </div>
          )}

          {/* Article Title */}
          <h1 className="font-black text-4xl md:text-5xl lg:text-6xl text-black leading-[0.9] mb-8 tracking-tight">
            {article.title}
          </h1>

          {/* Article Subtitle/Description */}
          {article.description && (
            <p className="text-gray-700 text-xl md:text-2xl leading-relaxed mb-10 font-light max-w-4xl">
              {article.description}
            </p>
          )}

          {/* Article Meta */}
          <div className="flex flex-col md:flex-row md:items-center justify-between border-t border-gray-200 pt-8 gap-6">
            <div className="flex items-center gap-6">
              {/* Author */}
              <div className="flex items-center gap-3">
                {article.author?.avatar ? (
                  <StrapiImage
                    src={article.author.avatar.url}
                    alt={article.author.avatar.alternativeText || article.author.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <User size={20} className="text-gray-500" />
                  </div>
                )}
                <div>
                  <p className="font-semibold text-black text-sm">
                    {article.author?.name || "غير محدد"}
                  </p>
                  {article.author?.jobTitle && (
                    <p className="text-gray-500 text-xs">
                      {article.author.jobTitle}
                      {article.author.organization && ` في ${article.author.organization}`}
                    </p>
                  )}
                </div>
              </div>

              {/* Date and Reading Time */}
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <time>{formatTimeAgo(article.publish_date)}</time>
                </div>
                <span>•</span>
                <span>5 دقائق قراءة</span>
              </div>
            </div>

            {/* Social Share */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500 font-medium">مشاركة:</span>
              <div className="flex items-center gap-2">
                <button className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-blue-600 hover:text-white transition-colors">
                  <Facebook size={16} />
                </button>
                <button className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-blue-400 hover:text-white transition-colors">
                  <Twitter size={16} />
                </button>
                <button className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-blue-700 hover:text-white transition-colors">
                  <Linkedin size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Image - Constrained size */}
      {article.cover_image && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="relative w-full h-[50vh] max-h-[600px] bg-gray-100 rounded-lg overflow-hidden">
            <StrapiImage
              src={article.cover_image.url}
              alt={article.cover_image.alternativeText || article.title}
              fill
              className="object-cover"
              priority
            />
            {article.cover_image.alternativeText && (
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 text-xs rounded">
                {article.cover_image.alternativeText}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Content wrapper with custom classes for image sizing */}
        <div className="prose prose-xl prose-gray max-w-none [&_img]:max-w-[600px] [&_img]:mx-auto [&_img]:my-8 [&_img]:block [&_img]:rounded-lg [&_img]:h-auto">
          {article.blocks && article.blocks.length > 0 ? (
            <ContentRenderer blocks={transformBlocksForRenderer(article.blocks)} />
          ) : (
            <div className="text-lg leading-relaxed space-y-8">
              <p className="text-2xl font-light text-gray-900 leading-relaxed mb-12 first-letter:text-6xl first-letter:font-bold first-letter:float-right first-letter:mr-2 first-letter:mt-1">
                في عالم الأعمال اليوم، نشهد تحولات جذرية تعيد تشكيل كيفية عمل الشركات والمؤسسات على مستوى العالم.
              </p>
              <p className="text-lg leading-relaxed text-gray-800">
                التكنولوجيا المتقدمة، والذكاء الاصطناعي، والتحول الرقمي ليست مجرد مفاهيم نظرية، بل حقائق ملموسة تؤثر على جميع جوانب الأعمال. هذه التطورات تتطلب من القادة إعادة النظر في استراتيجياتهم وأساليب عملهم لضمان البقاء في المقدمة.
              </p>
              <p className="text-lg leading-relaxed text-gray-800">
                من خلال تبني الابتكار والاستثمار في التقنيات الحديثة، تستطيع الشركات ليس فقط التكيف مع هذه التغيرات، بل أيضاً قيادة السوق نحو مستقبل أكثر إشراقاً وفعالية.
              </p>
            </div>
          )}
        </div>

        {/* Article Tags */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-gray-600 font-semibold">المواضيع:</span>
            {article.category && (
              <Link
                href={`/${article.category.slug}`}
                className="px-4 py-2 bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors uppercase tracking-wide"
              >
                {article.category.name}
              </Link>
            )}
            <span className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold transition-colors uppercase tracking-wide cursor-pointer">
              أعمال
            </span>
            <span className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold transition-colors uppercase tracking-wide cursor-pointer">
              ابتكار
            </span>
          </div>
        </div>

        {/* Author Bio */}
        {article.author && (
          <div className="mt-16 pt-8 border-t border-gray-200">
            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="flex items-start gap-6">
                {article.author.avatar && (
                  <StrapiImage
                    src={article.author.avatar.url}
                    alt={article.author.avatar.alternativeText || article.author.name}
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-full object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-black text-xl text-black mb-2">{article.author.name}</h3>
                  {article.author.jobTitle && (
                    <p className="text-gray-600 mb-4 font-medium">
                      {article.author.jobTitle}
                      {article.author.organization && ` في ${article.author.organization}`}
                    </p>
                  )}
                  {article.author.linkedin_url && (
                    <a
                      href={article.author.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                    >
                      <Linkedin size={18} />
                      تابع على LinkedIn
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Related Articles */}
      <section className="bg-gray-50 mt-20 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-1 h-8 bg-black"></div>
              <h2 className="font-black text-3xl text-black uppercase tracking-wide">مقالات ذات صلة</h2>
            </div>
            <p className="text-gray-600 text-lg">اكتشف المزيد من المحتوى المميز</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "مستقبل الذكاء الاصطناعي في الأعمال",
                category: "تكنولوجيا",
                image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=250&fit=crop&auto=format&q=80",
                slug: "ai-future-business",
                excerpt: "كيف تغير التقنيات الذكية وجه الصناعات الحديثة"
              },
              {
                title: "استراتيجيات النمو للشركات الناشئة",
                category: "ريادة الأعمال",
                image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=250&fit=crop&auto=format&q=80",
                slug: "startup-growth-strategies",
                excerpt: "دليل شامل لبناء شركة ناشئة ناجحة"
              },
              {
                title: "التحول الرقمي: دليل شامل للمؤسسات",
                category: "رقمنة",
                image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop&auto=format&q=80",
                slug: "digital-transformation-guide",
                excerpt: "خطوات عملية لتحويل مؤسستك رقمياً"
              },
            ].map((item, index) => (
              <article key={index} className="group bg-white overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <Link href={`/articles/${item.slug}`}>
                  <div className="relative w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                    <Image 
                      src={item.image} 
                      alt={item.title} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="bg-black text-white px-3 py-1 text-xs font-bold uppercase tracking-wider">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-black text-lg text-black leading-tight group-hover:text-gray-600 transition-colors mb-3 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                      {item.excerpt}
                    </p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="bg-black text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="inline-block bg-white text-black px-4 py-2 text-xs font-bold uppercase tracking-wider mb-6">
              NEWSLETTER
            </div>
            <h2 className="font-black text-4xl md:text-5xl mb-6 leading-tight">
              انضم إلى مجتمع الرواد
            </h2>
            <p className="text-gray-300 text-xl leading-relaxed max-w-2xl mx-auto">
              احصل على آخر الأفكار والاتجاهات في عالم الأعمال والتكنولوجيا مباشرة في صندوق بريدك
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              className="flex-1 px-6 py-4 text-black bg-white focus:outline-none focus:ring-2 focus:ring-white text-right font-medium"
            />
            <button className="bg-white text-black px-8 py-4 font-black hover:bg-gray-100 transition-colors uppercase tracking-wide">
              اشتراك
            </button>
          </div>
        </div>
      </section>
    </article>
  )
}