// // app/magazine/page.tsx
// "use client"
// import { getAllMagazineIssues } from "@/lib/strapi-client"
// import { useEffect, useState } from "react"
// import Link from "next/link"
// import Image from "next/image"

// interface Magazine {
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
// }

// export default function MagazinePage() {
//   const [magazines, setMagazines] = useState<Magazine[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     const fetchMagazines = async () => {
//       try {
//         const response = await getAllMagazineIssues()
//         if (response && response.data) {
//           // Transform the data to match the expected structure
//           const transformedMagazines: Magazine[] = response.data.map((item: any) => ({
//             id: item.id,
//             documentId: item.documentId,
//             title: item.title,
//             slug: item.slug,
//             issue_number: item.issue_number,
//             description: item.description,
//             publish_date: item.publish_date,
//             is_featured: item.is_featured,
//             cover_image: item.cover_image,
//             pdf_attachment: item.pdf_attachment
//           }))
//           setMagazines(transformedMagazines)
//         }
//       } catch (err) {
//         console.error("Failed to fetch magazines:", err)
//         setError("Failed to load magazines. Please try again later.")
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchMagazines()
//   }, [])

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-600">جاري التحميل...</p>
//         </div>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-red-600 mb-4">{error}</p>
//           <button 
//             onClick={() => window.location.reload()}
//             className="bg-orange-500 text-white px-6 py-3 hover:bg-orange-600 transition-colors"
//           >
//             إعادة المحاولة
//           </button>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Header */}
//       <div className="bg-gray-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="py-20 text-center">
//             <div className="mb-8">
//               <span className="inline-block bg-orange-500 text-white px-4 py-2 text-sm font-bold uppercase tracking-wide mb-4">
//                 مجلة
//               </span>
//             </div>
//             <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-6 tracking-tight leading-none">
//               شروع
//             </h1>
//             <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-medium">
//               العلامة الإعلامية العربية الرائدة في مجال الأعمال والابتكار والتكنولوجيا
//             </p>
//             <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center items-center">
//               <div className="text-center">
//                 <div className="text-3xl font-black text-gray-900">+100</div>
//                 <div className="text-sm text-gray-600 uppercase tracking-wide">مقالة شهرياً</div>
//               </div>
//               <div className="hidden sm:block w-px h-12 bg-gray-300"></div>
//               <div className="text-center">
//                 <div className="text-3xl font-black text-gray-900">+50K</div>
//                 <div className="text-sm text-gray-600 uppercase tracking-wide">قارئ نشط</div>
//               </div>
//               <div className="hidden sm:block w-px h-12 bg-gray-300"></div>
//               <div className="text-center">
//                 <div className="text-3xl font-black text-gray-900">+5</div>
//                 <div className="text-sm text-gray-600 uppercase tracking-wide">أعداد منشورة</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Magazine Grid */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
//           {magazines.map((magazine) => {
//             // Safe image URL handling for Strapi v5
//             const imageUrl = magazine.cover_image?.url ? (
//               magazine.cover_image.url.startsWith('/') 
//                 ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${magazine.cover_image.url}`
//                 : magazine.cover_image.url
//             ) : '/default-magazine-cover.jpg'
            
//             const imageAlt = magazine.cover_image?.alternativeText || magazine.title

//             // Clean description from HTML tags
//             const cleanDescription = magazine.description 
//               ? magazine.description.replace(/<[^>]*>/g, '').substring(0, 150)
//               : ''

//             return (
//               <article key={magazine.id} className="group">
//                 <Link href={`/magazine/${magazine.slug}`}>
//                   {/* Magazine Cover */}
//                   <div className="relative mb-6 overflow-hidden bg-gray-100">
//                     <div className="aspect-[3/4] relative">
//                       <Image
//                         src={imageUrl}
//                         alt={imageAlt}
//                         fill
//                         className="object-cover"
//                         onError={(e) => {
//                           e.currentTarget.src = '/default-magazine-cover.jpg'
//                         }}
//                       />
//                     </div>
                    
//                     {/* Featured Badge */}
//                     {magazine.is_featured && (
//                       <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 text-sm font-bold uppercase tracking-wide">
//                         مميز
//                       </div>
//                     )}
//                   </div>

//                   {/* Magazine Info */}
//                   <div className="space-y-3">
//                     <div className="flex items-center gap-3">
//                       <span className="bg-orange-500 text-white px-3 py-1 text-sm font-bold uppercase tracking-wide">
//                         العدد {magazine.issue_number}
//                       </span>
//                       <span className="text-gray-500 text-sm">
//                         {new Date(magazine.publish_date).toLocaleDateString('ar-EG', {
//                           year: 'numeric',
//                           month: 'long'
//                         })}
//                       </span>
//                     </div>
                    
//                     <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
//                       {magazine.title}
//                     </h2>
                    
//                     <div className="pt-2">
//                       <span className="text-orange-500 font-semibold text-sm">
//                         اقرأ المزيد →
//                       </span>
//                     </div>
//                   </div>
//                 </Link>
//               </article>
//             )
//           })}
//         </div>

//         {/* Empty State */}
//         {magazines.length === 0 && (
//           <div className="text-center py-16">
//             <div className="text-6xl mb-6">📖</div>
//             <h2 className="text-2xl font-bold text-gray-900 mb-4">لا توجد أعداد متاحة حالياً</h2>
//             <p className="text-gray-600">تحقق مرة أخرى لاحقاً للحصول على أحدث الأعداد</p>
//           </div>
//         )}

//         {/* Load More Button */}
//         {magazines.length > 0 && (
//           <div className="text-center mt-16">
//             <button className="bg-gray-900 text-white px-8 py-4 text-lg font-bold hover:bg-orange-500 transition-colors duration-300 uppercase tracking-wide">
//               عرض المزيد
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Newsletter Section */}
//       <div className="bg-gray-50 border-t border-gray-200">
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
//           <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
//             ابق على اطلاع دائم
//           </h3>
//           <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
//             احصل على آخر الأعداد والمحتوى الحصري مباشرة في بريدك الإلكتروني
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
//       </div>
//     </div>
//   )
// }
import { MagazineList } from "../magazine/magazine-list"

export default function MagazinePage() {
  return <MagazineList />
}

export const metadata = {
  title: "المجلة - حيث تلتقي الأعمال والتصميم",
  description: "العلامة الإعلامية العربية الرائدة في مجال الأعمال والابتكار والتكنولوجيا",
}
