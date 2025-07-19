// // app/magazine/[slug]/page.tsx
// "use client"
// import { getMagazineIssueBySlug } from "@/lib/strapi-client"
// import { useParams, useRouter } from "next/navigation"
// import { useEffect, useState } from "react"
// import Image from "next/image"

// // Helper function to format date safely
// const formatDate = (dateString: string) => {
//   try {
//     const date = new Date(dateString)
//     return date.toLocaleDateString('ar-EG', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     })
//   } catch (error) {
//     return dateString
//   }
// }

// interface MagazineDetails {
//   id: string
//   documentId: string
//   title: string
//   slug: string
//   issue_number: number
//   description: string
//   publish_date: string
//   is_featured: boolean
//   cover_image: {
//     id: number
//     documentId: string
//     url: string
//     alternativeText: string | null
//     width: number
//     height: number
//   } | null
//   pdf_attachment?: {
//     id: number
//     documentId: string
//     name: string
//     url: string
//   } | null
//   articles?: Array<{
//     id: string
//     title: string
//     slug: string
//     publish_date: string
//     is_featured: boolean
//     cover_image: {
//       id: number
//       url: string
//       alternativeText: string | null
//     } | null
//     author: {
//       name: string
//     } | null
//   }>
//   SEO?: {
//     meta_title: string
//     meta_description: string
//     meta_keywords: string
//   }
// }

// export default function MagazineDetailsPage() {
//   const params = useParams()
//   const router = useRouter()
//   const slug = params.slug as string
//   const [magazine, setMagazine] = useState<MagazineDetails | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     const fetchMagazine = async () => {
//       try {
//         const response = await getMagazineIssueBySlug(slug)
//         if (response && response.data) {
//           setMagazine(response.data as MagazineDetails)
//         } else {
//           setError("Magazine not found")
//         }
//       } catch (err) {
//         console.error("Failed to fetch magazine:", err)
//         setError("Failed to load magazine. Please try again later.")
//       } finally {
//         setLoading(false)
//       }
//     }

//     if (slug) {
//       fetchMagazine()
//     }
//   }, [slug])

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-600">جاري تحميل المجلة...</p>
//         </div>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <div className="text-center">
//           <div className="text-6xl mb-6">📖</div>
//           <h2 className="text-2xl font-bold text-gray-900 mb-4">عذراً، لم نتمكن من العثور على هذه المجلة</h2>
//           <p className="text-red-600 mb-8">{error}</p>
//                         <div className="flex gap-4 justify-center">
//             <button 
//               onClick={() => window.location.reload()}
//               className="bg-orange-500 text-white px-6 py-3 hover:bg-orange-600"
//             >
//               إعادة المحاولة
//             </button>
//             <button 
//               onClick={() => router.push('/magazine')}
//               className="bg-gray-900 text-white px-6 py-3 hover:bg-gray-800"
//             >
//               العودة إلى المجلة
//             </button>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (!magazine) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <p className="text-gray-600">Magazine not found</p>
//       </div>
//     )
//   }

//   // Safe image URL handling for Strapi v5
//   const imageUrl = magazine.cover_image?.url ? (
//     magazine.cover_image.url.startsWith('/') 
//       ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${magazine.cover_image.url}`
//       : magazine.cover_image.url
//   ) : '/default-magazine-cover.jpg'
  
//   const imageAlt = magazine.cover_image?.alternativeText || magazine.title

//   // Safe PDF handling for Strapi v5
//   const pdfUrl = magazine.pdf_attachment?.url ? (
//     magazine.pdf_attachment.url.startsWith('/')
//       ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${magazine.pdf_attachment.url}`
//       : magazine.pdf_attachment.url
//   ) : null

//   return (
//     <div className="min-h-screen bg-white" dir="rtl">
//       {/* Header */}
//       <header className="bg-white border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="py-8">
//             <button 
//               onClick={() => router.push('/magazine')}
//               className="flex items-center gap-2 text-gray-600 hover:text-orange-500 mb-6"
//             >
//               <span>←</span>
//               <span>العودة إلى المجلة</span>
//             </button>
            
//             <div className="text-center">
//               <div className="flex items-center justify-center gap-4 mb-4">
//                 <div className="inline-block bg-orange-500 text-white px-4 py-2 text-sm font-bold uppercase tracking-wide">
//                   العدد {magazine.issue_number}
//                 </div>
//                 {magazine.is_featured && (
//                   <div className="inline-block bg-green-500 text-white px-4 py-2 text-sm font-bold uppercase tracking-wide">
//                     مميز
//                   </div>
//                 )}
//               </div>
//               <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-4 tracking-tight">
//                 {magazine.title}
//               </h1>
//               <p className="text-gray-600 text-lg">
//                 {formatDate(magazine.publish_date)}
//               </p>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
//           {/* Magazine Cover */}
//           <div className="order-2 lg:order-1">
//             <div className="sticky top-8">
//               <div className="aspect-[3/4] relative bg-gray-100 mb-8">
//                 <Image
//                   src={imageUrl}
//                   alt={imageAlt}
//                   fill
//                   className="object-cover"
//                   onError={(e) => {
//                     e.currentTarget.src = '/default-magazine-cover.jpg'
//                   }}
//                 />
//               </div>
              
//               {/* Action Buttons */}
//               <div className="space-y-4">
//                 {pdfUrl && (
//                   <a
//                     href={pdfUrl}
//                     download={magazine.pdf_attachment?.name || 'magazine.pdf'}
//                     className="block w-full bg-orange-500 text-white text-center py-4 px-6 font-bold text-lg hover:bg-orange-600"
//                   >
//                     تحميل العدد PDF
//                   </a>
//                 )}
                
//                 <button className="block w-full bg-gray-900 text-white text-center py-4 px-6 font-bold text-lg hover:bg-gray-800">
//                   قراءة العدد اونلاين
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Magazine Content */}
//           <div className="order-1 lg:order-2">
//             <div className="prose prose-lg max-w-none">
//               <h2 className="text-2xl font-bold text-gray-900 mb-6">
//                 في هذا العدد
//               </h2>
              
//               {magazine.description && (
//                 <div 
//                   className="text-gray-700 leading-relaxed"
//                   dangerouslySetInnerHTML={{ __html: magazine.description }}
//                 />
//               )}
//             </div>

//             {/* Articles Section */}
//             {magazine.articles && magazine.articles.length > 0 && (
//               <div className="mt-12 pt-12 border-t border-gray-200">
//                 <h3 className="text-xl font-bold text-gray-900 mb-8">
//                   المقالات في هذا العدد
//                 </h3>
                
//                 <div className="space-y-6">
//                   {magazine.articles.map((article) => (
//                     <div key={article.id} className="flex gap-4 p-4 hover:bg-gray-50">
//                       {article.cover_image && (
//                         <div className="flex-shrink-0">
//                           <Image
//                             src={article.cover_image.url.startsWith('/') 
//                               ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${article.cover_image.url}`
//                               : article.cover_image.url}
//                             alt={article.cover_image.alternativeText || article.title}
//                             width={80}
//                             height={60}
//                             className="object-cover"
//                           />
//                         </div>
//                       )}
//                       <div className="flex-1">
//                         <h4 className="font-semibold text-gray-900 mb-2">{article.title}</h4>
//                         <div className="flex items-center gap-4 text-sm text-gray-600">
//                           {article.author && <span>بقلم: {article.author.name}</span>}
//                           <span>
//                             {formatDate(article.publish_date)}
//                           </span>
//                           {article.is_featured && (
//                             <span className="bg-orange-100 text-orange-800 px-2 py-1 text-xs font-bold uppercase">
//                               مميز
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Features Section */}
//             <div className="mt-12 pt-12 border-t border-gray-200">
//               <h3 className="text-xl font-bold text-gray-900 mb-8">
//                 المميزات
//               </h3>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                 <div className="space-y-4">
//                   <div className="w-12 h-12 bg-orange-500 flex items-center justify-center">
//                     <span className="text-white text-xl">📱</span>
//                   </div>
//                   <h4 className="font-bold text-gray-900">قراءة رقمية</h4>
//                   <p className="text-gray-600">
//                     اقرأ العدد كاملاً على أي جهاز بجودة عالية
//                   </p>
//                 </div>
                
//                 <div className="space-y-4">
//                   <div className="w-12 h-12 bg-orange-500 flex items-center justify-center">
//                     <span className="text-white text-xl">⬇️</span>
//                   </div>
//                   <h4 className="font-bold text-gray-900">تحميل مجاني</h4>
//                   <p className="text-gray-600">
//                     حمل العدد بصيغة PDF واحتفظ به لاحقاً
//                   </p>
//                 </div>
                
//                 <div className="space-y-4">
//                   <div className="w-12 h-12 bg-orange-500 flex items-center justify-center">
//                     <span className="text-white text-xl">🔄</span>
//                   </div>
//                   <h4 className="font-bold text-gray-900">محتوى محدث</h4>
//                   <p className="text-gray-600">
//                     آخر الأخبار والمقالات في عالم الأعمال
//                   </p>
//                 </div>
                
//                 <div className="space-y-4">
//                   <div className="w-12 h-12 bg-orange-500 flex items-center justify-center">
//                     <span className="text-white text-xl">💡</span>
//                   </div>
//                   <h4 className="font-bold text-gray-900">رؤى حصرية</h4>
//                   <p className="text-gray-600">
//                     تحليلات وآراء خبراء في مختلف المجالات
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>

//       {/* Newsletter Section */}
//       <section className="bg-gray-50 border-t border-gray-200">
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
//           <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
//             لا تفوت الأعداد القادمة
//           </h3>
//           <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
//             اشترك في قائمتنا البريدية لتحصل على إشعار فور صدور العدد الجديد
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
//             <input
//               type="email"
//               placeholder="البريد الإلكتروني"
//               className="flex-1 px-4 py-3 border border-gray-300 focus:outline-none focus:border-orange-500 text-right"
//             />
//             <button className="bg-orange-500 text-white px-6 py-3 font-bold hover:bg-orange-600 transition-colors whitespace-nowrap">
//               اشتراك
//             </button>
//           </div>
//         </div>
//       </section>
//     </div>
//   )
// }

import { MagazineDetail } from "../magazine-detail"

interface MagazinePageProps {
  params: {
    slug: string
  }
}

export default async function MagazineDetailPage({ params }: MagazinePageProps) {
  return <MagazineDetail slug={params.slug} />
}

// export async function generateMetadata({ params }: MagazinePageProps) {
//   return {
//     title: `العدد - ${params.slug}`,
//     description: "اقرأ أحدث عدد من مجلتنا المتخصصة في الأعمال والتكنولوجيا",
//   }

