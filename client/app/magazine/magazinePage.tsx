// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { MagazineDetails } from "../magazine/types-magazine";

// // Magazine details data
// const magazineDetailsData: Record<string, MagazineDetails> = {
//   "current-issue-2024": {
//     id: "current-issue-2024",
//     title: "العدد الحالي",
//     season: "صيف 2024",
//     issue: "العدد 16",
//     coverImage: "/magazine-covers/current-issue.jpg",
//     description: "العدد الأحدث من مجلة فاست كومباني يتناول أحدث الاتجاهات التقنية والابتكارات في عالم الأعمال.",
//     articles: [
//       {
//         title: "تقنيات الذكاء الاصطناعي الجديدة",
//         description: "نظرة على أحدث التطورات في مجال الذكاء الاصطناعي",
//         author: "فريق التحرير",
//         imageAlt: "/articles/new-ai-tech.jpg"
//       }
//     ],
//     features: [
//       {
//         title: "محتوى حصري",
//         description: "مقالات ومقابلات حصرية مع قادة الصناعة"
//       }
//     ]
//   },
//   "ai-revolution-spring-2024": {
//     id: "ai-revolution-spring-2024",
//     title: "ثورة الذكاء الاصطناعي",
//     season: "ربيع 2024",
//     issue: "العدد 15",
//     coverImage: "/magazine-covers/ai-revolution.jpg",
//     description: "استكشف كيف تغير تقنيات الذكاء الاصطناعي وجه الأعمال والمجتمع في عالمنا اليوم. من التطبيقات العملية إلى التحديات الأخلاقية.",
//     articles: [
//       {
//         title: "الذكاء الاصطناعي في الطب",
//         description: "كيف تساعد تقنيات AI في تشخيص الأمراض وتطوير العلاجات",
//         author: "د. أحمد محمد",
//         imageAlt: "/articles/ai-medicine.jpg"
//       },
//       {
//         title: "مستقبل التوظيف مع AI",
//         description: "التحديات والفرص التي يخلقها الذكاء الاصطناعي في سوق العمل",
//         author: "سارة أحمد",
//         imageAlt: "/articles/ai-jobs.jpg"
//       }
//     ],
//     features: [
//       {
//         title: "تحليل شامل للسوق",
//         description: "دراسة معمقة لأحدث اتجاهات الذكاء الاصطناعي"
//       },
//       {
//         title: "مقابلات حصرية",
//         description: "لقاءات مع رواد الصناعة والخبراء المتخصصين"
//       }
//     ]
//   },
//   "future-work-winter-2023": {
//     id: "future-work-winter-2023",
//     title: "مستقبل العمل",
//     season: "شتاء 2023",
//     issue: "العدد 14",
//     coverImage: "/magazine-covers/future-work.jpg",
//     description: "نظرة على تطور بيئة العمل والتقنيات الجديدة التي تشكل مستقبل المهن والوظائف.",
//     articles: [
//       {
//         title: "العمل الهجين الجديد",
//         description: "كيف تتكيف الشركات مع نماذج العمل المرنة",
//         author: "محمد علي",
//         imageAlt: "/articles/hybrid-work.jpg"
//       }
//     ],
//     features: [
//       {
//         title: "دليل العمل عن بُعد",
//         description: "نصائح وأدوات للنجاح في العمل من المنزل"
//       }
//     ]
//   },
//   "climate-tech-fall-2023": {
//     id: "climate-tech-fall-2023",
//     title: "حلول تكنولوجيا المناخ",
//     season: "خريف 2023",
//     issue: "العدد 13",
//     coverImage: "/magazine-covers/climate-tech.jpg",
//     description: "التقنيات المبتكرة التي تساعد في مواجهة تحدي التغير المناخي وبناء مستقبل مستدام.",
//     articles: [
//       {
//         title: "الطاقة المتجددة الجديدة",
//         description: "أحدث الابتكارات في مجال الطاقة الشمسية وطاقة الرياح",
//         author: "فاطمة حسن",
//         imageAlt: "/articles/renewable-energy.jpg"
//       }
//     ],
//     features: [
//       {
//         title: "خارطة طريق الكربون",
//         description: "استراتيجيات الشركات للوصول إلى الحياد الكربوني"
//       }
//     ]
//   },
//   "startup-nation-summer-2023": {
//     id: "startup-nation-summer-2023",
//     title: "أمة الشركات الناشئة",
//     season: "صيف 2023",
//     issue: "العدد 12",
//     coverImage: "/magazine-covers/startup-nation.jpg",
//     description: "قصص نجاح الشركات الناشئة وريادة الأعمال في المنطقة العربية والعالم.",
//     articles: [
//       {
//         title: "رحلة نجاح ناشئة تقنية",
//         description: "من الفكرة إلى التقييم المليوني - قصة نجاح ملهمة",
//         author: "عمر الخطيب",
//         imageAlt: "/articles/startup-success.jpg"
//       }
//     ],
//     features: [
//       {
//         title: "دليل المستثمر",
//         description: "كيفية تقييم الشركات الناشئة والاستثمار فيها"
//       }
//     ]
//   }
// };

// interface PageProps {
//   params: Promise<{
//     id: string;
//   }>;
// }

// export default async function MagazineDetailsPage({ params }: PageProps) {
//   // Await the params in Next.js 15+
//   const { id } = await params;
//   const magazineData = magazineDetailsData[id];

//   if (!magazineData) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <div className="text-center">
//           <h1 className="text-4xl font-bold text-black mb-4">العدد غير موجود</h1>
//           <p className="text-gray-600 mb-8">لم نتمكن من العثور على العدد المطلوب</p>
//           <Link
//             href="/magazine" 
//             className="bg-black text-white px-8 py-4 rounded-full font-bold hover:bg-gray-800 transition-colors inline-block"
//           >
//             العودة للمجلة
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white min-h-screen">
//       {/* Hero Section */}
//       <section className="max-w-7xl mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
//           {/* Magazine Cover */}
//           <div className="flex justify-center lg:justify-end">
//             <Image
//               src={magazineData.coverImage}
//               alt={magazineData.title}
//               width={500}
//               height={700}
//               className="w-full max-w-lg h-auto object-cover rounded-lg shadow-2xl"
//               priority
//             />
//           </div>

//           {/* Magazine Info */}
//           <div className="space-y-6">
//             <h1 className="text-4xl md:text-6xl font-bold text-black">
//               {magazineData.title}
//             </h1>
//             <p className="text-gray-500 text-lg uppercase">
//               {magazineData.season} | {magazineData.issue}
//             </p>
//             <p className="text-gray-700 text-lg">{magazineData.description}</p>
//             <div className="flex gap-4">
//               <button className="bg-black text-white px-8 py-4 rounded-full font-bold hover:bg-gray-800">
//                 قراءة العدد
//               </button>
//               <button className="border-2 border-black px-8 py-4 rounded-full font-bold hover:bg-black hover:text-white">
//                 تحميل PDF
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Articles Section */}
//       {Array.isArray(magazineData.articles) && magazineData.articles.length > 0 && (
//         <section className="bg-gray-50 py-16">
//           <div className="max-w-7xl mx-auto px-4">
//             <h2 className="text-3xl font-bold text-center mb-12">محتويات العدد</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//               {magazineData.articles.map((article, index) => (
//                 <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
//                   {article.imageAlt && (
//                     <Image
//                       src={article.imageAlt}
//                       alt={article.title}
//                       width={300}
//                       height={200}
//                       className="w-full h-48 object-cover rounded-lg mb-4"
//                     />
//                   )}
//                   <h3 className="text-xl font-bold mb-2">{article.title}</h3>
//                   <p className="text-gray-600 mb-2">{article.description}</p>
//                   {article.author && (
//                     <p className="text-sm text-gray-500">بقلم: {article.author}</p>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>
//       )}

//       {/* Features Section */}
//       {Array.isArray(magazineData.features) && magazineData.features.length > 0 && (
//         <section className="py-16">
//           <div className="max-w-7xl mx-auto px-4">
//             <h2 className="text-3xl font-bold text-center mb-12">مميزات هذا العدد</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
//               {magazineData.features.map((feature, index) => (
//                 <div key={index} className="flex items-start gap-4">
//                   <div className="flex-shrink-0 w-12 h-12 bg-black rounded-full flex items-center justify-center">
//                     <span className="text-white font-bold">{index + 1}</span>
//                   </div>
//                   <div>
//                     <h3 className="text-xl font-bold text-black mb-2">
//                       {feature.title}
//                     </h3>
//                     <p className="text-gray-600">{feature.description}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>
//       )}

//       {/* Back to Magazine Button */}
//       <section className="py-8">
//         <div className="max-w-7xl mx-auto px-4 text-center">
//           <Link
//             href="/magazine"
//             className="bg-gray-100 text-black px-8 py-4 rounded-full font-bold hover:bg-gray-200 transition-colors inline-block"
//           >
//             العودة إلى المجلة
//           </Link>
//         </div>
//       </section>
//     </div>
//   );
// }
