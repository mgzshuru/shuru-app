import React from 'react';

// Magazine details data in Arabic
const magazineDetailsData = {
  "current-issue-2024": {
    id: "current-issue-2024",
    title: "العدد الحالي",
    season: "صيف 2024",
    issue: "العدد 16",
    coverImage: "/placeholder.svg",
    description: "العدد الأحدث من مجلة فاست كومباني يتناول أحدث الاتجاهات التقنية والابتكارات في عالم الأعمال.",
    mainArticle: {
      title: "تقنيات الذكاء الاصطناعي الجديدة",
      description: "نظرة شاملة على أحدث التطورات في مجال الذكاء الاصطناعي وتأثيرها على مستقبل الأعمال والتكنولوجيا في المنطقة العربية",
      imageAlt: "الذكاء الاصطناعي الجديد"
    },
    sideArticles: [
      {
        title: "الابتكار في التقنية المالية",
        description: "كيف تغير التقنيات المالية الجديدة وجه البنوك والمدفوعات",
        imageAlt: "التقنية المالية"
      },
      {
        title: "مستقبل التجارة الإلكترونية",
        description: "الاتجاهات الحديثة في عالم التسوق الرقمي والمبيعات عبر الإنترنت",
        imageAlt: "التجارة الإلكترونية"
      }
    ],
    bottomImages: [
      { imageAlt: "صورة إضافية 1" },
      { imageAlt: "صورة إضافية 2" }
    ],
    latestNews: {
      title: "آخر أخبار التقنية",
      items: [
        {
          category: "ذكاء اصطناعي",
          title: "شركات التقنية العربية تستثمر بقوة في الذكاء الاصطناعي",
          description: "تشهد المنطقة العربية نمواً متسارعاً في استثمارات الذكاء الاصطناعي، حيث تتجه الشركات الكبرى نحو تطوير حلول مبتكرة تخدم السوق المحلي والعالمي",
          imageAlt: "استثمار الذكاء الاصطناعي"
        },
        {
          category: "ريادة الأعمال",
          title: "صندوق استثماري جديد بقيمة مليار دولار لدعم الشركات الناشئة",
          description: "إطلاق صندوق استثماري ضخم يهدف إلى دعم الشركات الناشئة في مجال التكنولوجيا والابتكار عبر المنطقة العربية",
          imageAlt: "الاستثمار في الشركات الناشئة"
        },
        {
          category: "تكنولوجيا",
          title: "تطوير منصة جديدة للتعليم الرقمي باللغة العربية",
          description: "منصة تعليمية مبتكرة تستخدم أحدث التقنيات لتقديم محتوى تعليمي عالي الجودة باللغة العربية للطلاب في جميع أنحاء المنطقة",
          imageAlt: "التعليم الرقمي"
        }
      ]
    }
  }
};

export default function MagazineDetailsPage() {
  const magazineData = magazineDetailsData["current-issue-2024"];

  return (
    <div className="bg-white min-h-screen" dir="rtl">
      {/* Magazine Title */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 md:py-6">
        <h1 className="font-bold text-[24px] sm:text-[28px] uppercase leading-[22px] sm:leading-[26px] tracking-[2.4px] sm:tracking-[3.6px] md:text-[45px] md:leading-[38px] md:tracking-[6px] text-black text-center mb-4 md:mb-6">
          {magazineData.title}
        </h1>
        <p className="text-gray-500 text-lg uppercase text-center mb-2">
          {magazineData.season} | {magazineData.issue}
        </p>
        <p className="text-gray-700 text-center max-w-3xl mx-auto mb-8">
          {magazineData.description}
        </p>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button className="bg-black text-white px-8 py-4 rounded-full font-bold hover:bg-gray-800 transition-colors">
            قراءة العدد
          </button>
          <button className="border-2 border-black px-8 py-4 rounded-full font-bold hover:bg-black hover:text-white transition-colors">
            تحميل PDF
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {/* Right - Main Featured Article */}
          <div className="lg:col-span-5 mb-8 lg:mb-0 lg:order-2">
            <div className="relative w-full h-[220px] sm:h-[280px] md:h-[360px] mb-3 sm:mb-4">
              <img
                src={magazineData.coverImage}
                alt={magazineData.mainArticle.imageAlt}
                className="w-full h-full object-cover rounded-sm"
              />
            </div>
            <h2 className="font-bold text-black text-[18px] sm:text-[22px] md:text-[26px] leading-[20px] sm:leading-[24px] md:leading-[28px] mb-3 sm:mb-4">
              {magazineData.mainArticle.title}
            </h2>
            <p className="text-gray-600 text-[14px] sm:text-[15px] leading-[17px] sm:leading-[18px]">
              {magazineData.mainArticle.description}
            </p>
          </div>

          {/* Left - Grid of Articles and Images */}
          <div className="lg:col-span-7 lg:order-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Top Row Articles */}
              {magazineData.sideArticles.map((article, index) => (
                <div key={index} className="mb-4 sm:mb-6">
                  <div className="relative w-full h-[160px] sm:h-[180px] md:h-[200px] mb-2 sm:mb-3">
                    <img
                      src="/placeholder.svg"
                      alt={article.imageAlt}
                      className="w-full h-full object-cover rounded-sm"
                    />
                  </div>
                  <h3 className="font-bold text-black text-[14px] sm:text-[16px] md:text-[18px] leading-[16px] sm:leading-[18px] md:leading-[20px] mb-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-[12px] sm:text-[13px] leading-[15px] sm:leading-[16px]">
                    {article.description}
                  </p>
                </div>
              ))}

              {/* Bottom Row Images */}
              {magazineData.bottomImages.map((image, index) => (
                <div key={index} className="relative w-full h-[120px] sm:h-[140px] md:h-[160px]">
                  <img
                    src="/placeholder.svg"
                    alt={image.imageAlt}
                    className="w-full h-full object-cover rounded-sm"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Latest Magazine Content Section */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200">
          <h2 className="font-bold text-[20px] sm:text-[24px] uppercase leading-[18px] sm:leading-[22px] tracking-[2px] sm:tracking-[3px] md:text-[38px] md:leading-[32px] md:tracking-[5px] text-black text-right mb-6 sm:mb-8">
            {magazineData.latestNews.title}
          </h2>

          <div className="space-y-6 sm:space-y-8 md:space-y-10">
            {magazineData.latestNews.items.map((news, index) => (
              <div key={index} className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 items-start">
                <div className="lg:col-span-2 lg:order-1 order-2">
                  <div className="text-[9px] sm:text-[10px] md:text-[11px] text-gray-500 uppercase tracking-wide mb-2 sm:mb-3 font-medium">
                    {news.category}
                  </div>
                  <h3 className="font-bold text-black text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] leading-[18px] sm:leading-[20px] md:leading-[22px] lg:leading-[24px] mb-3 sm:mb-4">
                    {news.title}
                  </h3>
                  <p className="text-gray-600 text-[13px] sm:text-[14px] leading-[16px] sm:leading-[17px]">
                    {news.description}
                  </p>
                </div>
                <div className="lg:col-span-1 lg:order-2 order-1 mb-4 lg:mb-0">
                  <div className="relative w-full h-[140px] sm:h-[160px] md:h-[180px] mx-auto lg:mr-auto lg:ml-0 max-w-[320px] lg:max-w-[280px]">
                    <img
                      src="/placeholder.svg"
                      alt={news.imageAlt}
                      className="w-full h-full object-cover rounded-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Back to Magazine Button */}
        <div className="py-8 text-center">
          <button className="bg-gray-100 text-black px-8 py-4 rounded-full font-bold hover:bg-gray-200 transition-colors">
            العودة إلى المجلة
          </button>
        </div>
      </div>
    </div>
  );
}