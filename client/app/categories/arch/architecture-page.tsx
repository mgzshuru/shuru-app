import Image from "next/image"

// Define the type for the architecture data
interface ArchitecturePageData {
  mainArticle: {
    title: string;
    description: string;
    imageAlt: string;
  };
  sideArticles: {
    title: string;
    description: string;
    imageAlt: string;
  }[];
  bottomImages: {
    imageAlt: string;
  }[];
  latestNews: {
    title: string;
    items: {
      category: string;
      title: string;
      description: string;
      imageAlt: string;
    }[];
  };
}

export const ArchitecturePage = ({ data }: { data: ArchitecturePageData }) => {
  return (
    <div className="bg-white">
      {/* Architecture Title */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 md:py-6">
        <h1 className="font-bold font-beckett text-[24px] sm:text-[28px] uppercase leading-[22px] sm:leading-[26px] tracking-[2.4px] sm:tracking-[3.6px] md:text-[45px] md:leading-[38px] md:tracking-[6px] text-black text-center mb-4 md:mb-6">
          العمارة
        </h1>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {/* Left - Main Featured Article */}
          <div className="lg:col-span-5 mb-8 lg:mb-0">
            <div className="relative w-full h-[220px] sm:h-[280px] md:h-[360px] mb-3 sm:mb-4">
              <Image
                src="/placeholder.svg"
                alt={data.mainArticle.imageAlt}
                fill
                className="object-cover rounded-sm"
              />
            </div>
            <h2 className="font-centra font-bold text-black text-[18px] sm:text-[22px] md:text-[26px] leading-[20px] sm:leading-[24px] md:leading-[28px] mb-3 sm:mb-4">
              {data.mainArticle.title}
            </h2>
            <p className="font-centra text-gray-600 text-[14px] sm:text-[15px] leading-[17px] sm:leading-[18px]">
              {data.mainArticle.description}
            </p>
          </div>

          {/* Right - Grid of Articles and Images */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Top Row Articles */}
              {data.sideArticles.map((article, index) => (
                <div key={index} className="mb-4 sm:mb-6">
                  <div className="relative w-full h-[160px] sm:h-[180px] md:h-[200px] mb-2 sm:mb-3">
                    <Image
                      src="/placeholder.svg"
                      alt={article.imageAlt}
                      fill
                      className="object-cover rounded-sm"
                    />
                  </div>
                  <h3 className="font-centra font-bold text-black text-[14px] sm:text-[16px] md:text-[18px] leading-[16px] sm:leading-[18px] md:leading-[20px] mb-2">
                    {article.title}
                  </h3>
                  <p className="font-centra text-gray-600 text-[12px] sm:text-[13px] leading-[15px] sm:leading-[16px]">
                    {article.description}
                  </p>
                </div>
              ))}

              {/* Bottom Row Images */}
              {data.bottomImages.map((image, index) => (
                <div key={index} className="relative w-full h-[120px] sm:h-[140px] md:h-[160px]">
                  <Image
                    src="/placeholder.svg"
                    alt={image.imageAlt}
                    fill
                    className="object-cover rounded-sm"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Latest Architecture News Section */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200">
          <h2 className="font-bold font-beckett text-[20px] sm:text-[24px] uppercase leading-[18px] sm:leading-[22px] tracking-[2px] sm:tracking-[3px] md:text-[38px] md:leading-[32px] md:tracking-[5px] text-black text-left mb-6 sm:mb-8">
            {data.latestNews.title}
          </h2>

          <div className="space-y-6 sm:space-y-8 md:space-y-10" dir="rtl">
            {data.latestNews.items.map((news, index) => (
              <div key={index} className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 items-start">
                <div className="lg:col-span-2 lg:order-1 order-2">
                  <div className="font-centra text-[9px] sm:text-[10px] md:text-[11px] text-gray-500 uppercase tracking-wide mb-2 sm:mb-3 font-medium">
                    {news.category}
                  </div>
                  <h3 className="font-centra font-bold text-black text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] leading-[18px] sm:leading-[20px] md:leading-[22px] lg:leading-[24px] mb-3 sm:mb-4">
                    {news.title}
                  </h3>
                  <p className="font-centra text-gray-600 text-[13px] sm:text-[14px] leading-[16px] sm:leading-[17px]">
                    {news.description}
                  </p>
                </div>
                <div className="lg:col-span-1 lg:order-2 order-1 mb-4 lg:mb-0">
                  <div className="relative w-full h-[140px] sm:h-[160px] md:h-[180px] mx-auto lg:ml-auto lg:mr-0 max-w-[320px] lg:max-w-[280px]">
                    <img
                      style={{
                        position: 'absolute',
                        height: '100%',
                        width: '100%',
                        left: 0,
                        top: 0,
                        right: 100,
                        bottom: 0,
                        color: 'transparent'
                      }}
                      src="/placeholder.svg"
                      alt={news.imageAlt}
                      className="object-cover rounded-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>



        </div>
      </div>
    </div>
  )
}

// Sample data that matches the Fast Company layout
const sampleArchitectureData: ArchitecturePageData = {
  mainArticle: {
    title: "الطلاب صمموا هذه الكبائن غير العادية لتوفير الظل لحمامات السباحة العامة في نيوارك",
    description: "تم إضافة خمسة تصاميم للكبائن من إبداع طلاب الجامعات إلى حمامات السباحة العامة في جميع أنحاء مدينة نيوارك، نيو جيرسي.",
    imageAlt: "طلاب يجلسون على درجات خشبية برتقالية"
  },
  sideArticles: [
    {
      title: "سان فرانسيسكو حولت موقف سيارات قديم إلى مساكن ميسورة التكلفة لمعلمي المدارس العامة",
      description: "يأخذ هذا المشروع السكني للمنطقة التعليمية في سان فرانسيسكو أراضي غير مستخدمة ويعيد تخصيصها للإسكان الميسور التكلفة الذي تشتد الحاجة إليه.",
      imageAlt: "مبنى سكني حديث"
    },
    {
      title: "لماذا أعاد متحف المتروبوليتان نافذة بطول 200 قدم إلى الحياة في جناحه المُجدد",
      description: "ضوء الشمس والأعمال الفنية أعداء، لكن بالنسبة لجناح مايكل سي روكفلر المُعاد افتتاحه حديثًا، جعلت شركة WHY للهندسة المعمارية النافذة العملاقة نقطة الارتكاز.",
      imageAlt: "داخل المتحف مع الزوار"
    }
  ],
  bottomImages: [
    { imageAlt: "عمارة على الواجهة البحرية" },
    { imageAlt: "عمارة قرية جبلية" }
  ],
  latestNews: {
    title: "أحدث أخبار العمارة",
    items: [
      {
        category: "مجلس تأثير فاست كومباني",
        title: "لماذا يجب أن نعيد النظر في معنى المساحات المفتوحة",
        description: "إعادة تخيل المساحة المفتوحة لا يعني التفكير بشكل أكبر - بل التفكير بشكل أعمق.",
        imageAlt: "داخلية معمارية وردية"
      },
      {
        category: "التصميم",
        title: "مشروباتك العسلية تدفع تكلفة تجديد ملعب آرثر آش بقيمة 800 مليون دولار",
        description: "أكبر ملعب تنس في العالم على وشك الحصول على ترقية فاخرة.",
        imageAlt: "منظر جوي لملعب التنس"
      }
    ]
  }
};

// Default export for easy usage
export default function ArchitecturePageWrapper() {
  return <ArchitecturePage data={sampleArchitectureData} />;
}