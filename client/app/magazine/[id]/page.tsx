import React from 'react';


const magazineData = {
  title: "مجلة التصميم العربي",
  season: "ربيع 2025",
  issue: "العدد 42",
  description: "مجلة متخصصة في التصميم والهندسة المعمارية والفنون البصرية تقدم أحدث الاتجاهات والمشاريع الإبداعية في العالم العربي",
  coverImage: "/maCover.jpg",
  mainArticle: {
    title: "ثورة التصميم المعماري في دول الخليج العربي",
    description: "استكشاف للمشاريع المعمارية الرائدة التي تعيد تشكيل المشهد الحضري في المنطقة، من ناطحات السحاب المبتكرة إلى المجمعات الثقافية الحديثة التي تجمع بين الأصالة والحداثة في تصاميم مبتكرة تعكس الهوية العربية المعاصرة.",
    imageAlt: "مشروع معماري حديث",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  sideArticles: [
    {
      title: "الفن الرقمي والذكاء الاصطناعي",
      description: "كيف يغير الذكاء الاصطناعي مشهد الفن الرقمي والتصميم الجرافيكي في العالم العربي",
      imageAlt: "فن رقمي",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    },
    {
      title: "التصميم المستدام والبيئة",
      description: "أحدث الاتجاهات في التصميم المستدام وتأثيره الإيجابي على البيئة والمجتمع",
      imageAlt: "تصميم مستدام",
      image: "https://images.unsplash.com/photo-1558618666-fcdaeb0e8b25?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    },
    {
      title: "الهوية البصرية للعلامات التجارية",
      description: "دليل شامل لإنشاء هوية بصرية قوية ومميزة تعكس قيم وشخصية العلامة التجارية",
      imageAlt: "هوية بصرية",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    },
    {
      title: "مستقبل التصميم الداخلي",
      description: "نظرة استشرافية على الاتجاهات الجديدة في عالم التصميم الداخلي والديكور",
      imageAlt: "تصميم داخلي",
      image: "https://images.unsplash.com/photo-1586023492732-e7e6c8c4c2c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    }
  ],
  galleryImages: [
    {
      imageAlt: "معرض فني معاصر",
      image: "https://images.unsplash.com/photo-1578662996442-b9e64c5edf1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    },
    {
      imageAlt: "ورشة تصميم إبداعية",
      image: "https://images.unsplash.com/photo-1571115764229-c9b7b1c7d6e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    }
  ],
  latestNews: {
    title: "أحدث الأخبار والمقالات",
    items: [
      {
        category: "معمار",
        title: "افتتاح متحف الفن المعاصر الجديد في دبي",
        description: "يضم المتحف مجموعة متنوعة من الأعمال الفنية المعاصرة لفنانين عرب وعالميين، ويتميز بتصميمه المعماري الفريد الذي يمزج بين الحداثة والتراث العربي الأصيل. يعتبر هذا المتحف إضافة مهمة للمشهد الثقافي في المنطقة.",
        imageAlt: "متحف دبي للفن المعاصر",
        image: "https://images.unsplash.com/photo-1580741569-2e86149013a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      },
      {
        category: "تكنولوجيا",
        title: "تطبيقات الواقع المعزز في التصميم المعماري",
        description: "كيف تستخدم شركات التصميم تقنيات الواقع المعزز لتحسين عملية التصميم وتقديم تجربة أفضل للعملاء في استعراض المشاريع قبل التنفيذ. هذه التقنيات تساعد المهندسين والمعماريين على تصور أفضل للمشاريع.",
        imageAlt: "تطبيقات الواقع المعزز",
        image: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      },
      {
        category: "فنون",
        title: "معرض الفن الإسلامي المعاصر في الرياض",
        description: "يستمر المعرض لمدة ثلاثة أشهر ويضم أعمالاً لأكثر من 50 فناناً من مختلف أنحاء العالم الإسلامي، مع التركيز على الفن المعاصر المستوحى من التراث الإسلامي. المعرض يهدف إلى ربط الماضي بالحاضر.",
        imageAlt: "معرض الفن الإسلامي",
        image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      }
    ]
  }
};

// Header Component
const MagazineHeader = () => (
  <header className="bg-white border-b-2 border-gray-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-12 md:py-16 text-center">
        <h1 className="font-black text-[32px] sm:text-[42px] md:text-[56px] lg:text-[72px] 
                       leading-[0.9] tracking-[-0.03em] text-gray-900 mb-6">
          {magazineData.title}
        </h1>
        <div className="flex items-center justify-center space-x-4 space-x-reverse">
          <span className="inline-block w-3 h-3 bg-orange-500 rounded-full"></span>
          <p className="text-gray-600 text-lg font-medium">
            {magazineData.season} | {magazineData.issue}
          </p>
          <span className="inline-block w-3 h-3 bg-orange-500 rounded-full"></span>
        </div>
      </div>
    </div>
  </header>
);

// Cover Section Component
const CoverSection = () => (
  <section className="bg-gradient-to-b from-gray-50 to-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

        {/* Magazine Cover */}
        <div className="flex justify-center lg:justify-end order-1 lg:order-1">
          <div className="relative group">
            {/* <div className="absolute -inset-4 bg-gradient-to-r from-orange-400 to-orange-600 opacity-20 group-hover:opacity-30 transition duration-1000"></div> */}
            <div className="relative w-full max-w-[420px] h-[630px] overflow-hidden">
              <img
                src={magazineData.coverImage}
                alt="غلاف المجلة"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-6 right-6 bg-orange-500 text-white px-4 py-2 font-bold text-sm">
                العدد الجديد
              </div>
            </div>
          </div>
        </div>

        {/* Magazine Details */}
        <div className="order-2 lg:order-2 space-y-8">
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
              اكتشف عالم التصميم العربي
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              {magazineData.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="group bg-orange-500 text-white px-8 py-4 font-bold text-lg 
                             hover:bg-orange-600 transition-all duration-300 transform hover:scale-105
                             focus:outline-none focus:ring-4 focus:ring-orange-200">
              <span className="flex items-center justify-center gap-3">
                قراءة العدد
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </span>
            </button>
            <button className="border-2 border-orange-500 text-orange-500 px-8 py-4 font-bold text-lg 
                             hover:bg-orange-500 hover:text-white transition-all duration-300
                             focus:outline-none focus:ring-4 focus:ring-orange-200">
              تحميل PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// Article Card Component
type Article = {
  title: string;
  description: string;
  imageAlt: string;
  image: string;
};

type ArticleCardProps = {
  article: Article;
  isMainArticle?: boolean;
};

const ArticleCard = ({ article, isMainArticle = false }: ArticleCardProps) => (
  <article className={`group bg-white hover:shadow-lg transition-all duration-300 ${isMainArticle ? 'h-full' : ''}`}>
    <div className="relative overflow-hidden">
      <img
        src={article.image}
        alt={article.imageAlt}
        className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${isMainArticle ? 'h-[320px] sm:h-[380px] md:h-[420px]' : 'h-[200px] sm:h-[220px]'
          }`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
    <div className={`${isMainArticle ? 'p-6' : 'py-5'}`}>
      <h3 className={`font-bold text-gray-900 leading-tight mb-3 group-hover:text-orange-600 transition-colors cursor-pointer ${isMainArticle ? 'text-[22px] sm:text-[26px] md:text-[30px] mb-4' : 'text-[16px] sm:text-[18px]'
        }`}>
        {article.title}
      </h3>
      <p className={`text-gray-600 leading-relaxed ${isMainArticle ? 'text-[16px] sm:text-[17px]' : 'text-[14px] sm:text-[15px]'
        }`}>
        {article.description}
      </p>
      {isMainArticle && (
        <button className="mt-6 text-orange-500 font-semibold hover:text-orange-600 
                         flex items-center gap-2 group transition-colors">
          اقرأ المزيد
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  </article>
);

// Main Content Grid Component
const MainContentGrid = () => (
  <section className="bg-white">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">

        {/* Main Featured Article */}
        <div className="lg:col-span-5 lg:order-2">
          <ArticleCard article={magazineData.mainArticle} isMainArticle={true} />
        </div>

        {/* Side Articles Grid */}
        <div className="lg:col-span-7 lg:order-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {/* Articles */}
            {magazineData.sideArticles.map((article, index) => (
              <div key={index} className="mb-8">
                <ArticleCard article={article} />
              </div>
            ))}

            {/* Gallery Images */}
            {magazineData.galleryImages.map((image, index) => (
              <div key={index} className="group relative h-[160px] sm:h-[180px] overflow-hidden cursor-pointer">
                <img
                  src={image.image}
                  alt={image.imageAlt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    {image.imageAlt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

// News Article Component
type NewsArticleProps = {
  news: {
    category: string;
    title: string;
    description: string;
    imageAlt: string;
    image: string;
  };
  index: number;
};

const NewsArticle = ({ news, index }: NewsArticleProps) => (
  <article className="group">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
      <div className="lg:order-1 order-2">
        <div className="inline-block bg-orange-100 text-orange-700 px-3 py-1 
                      text-xs font-bold uppercase tracking-wide mb-4 rounded-full">
          {news.category}
        </div>
        <h3 className="font-bold text-gray-900 text-[20px] sm:text-[24px] lg:text-[26px] 
                     leading-tight mb-4 group-hover:text-orange-600 transition-colors cursor-pointer">
          {news.title}
        </h3>
        <p className="text-gray-600 text-[15px] sm:text-[16px] leading-relaxed mb-4">
          {news.description}
        </p>
        <button className="text-orange-500 font-semibold text-sm hover:text-orange-600 
                         flex items-center gap-2 group transition-colors">
          اقرأ القصة كاملة
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      <div className="lg:order-2 order-1">
        <div className="relative h-[220px] sm:h-[260px] overflow-hidden group cursor-pointer">
          <img
            src={news.image}
            alt={news.imageAlt}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </div>
    </div>
  </article>
);

// Advertisement Component
type AdvertisementBlockProps = {
  height: string;
  size: string;
};

const AdvertisementBlock = ({ height, size }: AdvertisementBlockProps) => (
  <div className={`bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-dashed border-orange-300 
                  ${height} flex items-center justify-center group hover:border-orange-400 transition-colors`}>
    <div className="text-center text-gray-500 group-hover:text-gray-600 transition-colors">
      <div className="text-3xl mb-3">🎯</div>
      <div className="text-sm font-medium">مساحة إعلانية</div>
      <div className="text-xs mt-1">{size}</div>
    </div>
  </div>
);

// Latest News Section Component
const LatestNewsSection = () => (
  <section className="bg-gray-50">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      {/* Section Header */}
      <div className="text-center mb-16">
        <h2 className="font-black text-[28px] sm:text-[36px] md:text-[44px] 
                     text-gray-900 mb-4 tracking-tight">
          {magazineData.latestNews.title}
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto rounded-full"></div>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-10">

        {/* News Articles */}
        <div className="lg:col-span-3 space-y-16">
          {magazineData.latestNews.items.map((news, index) => (
            <div key={index}>
              <NewsArticle news={news} index={index} />
              {index < magazineData.latestNews.items.length - 1 && (
                <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mt-16"></div>
              )}
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-8">
            <AdvertisementBlock height="h-[320px]" size="300 × 250" />
            <AdvertisementBlock height="h-[280px]" size="300 × 200" />

            {/* Newsletter Signup */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500 rounded-full opacity-10 transform translate-x-16 -translate-y-16"></div>
              <div className="relative">
                <h4 className="font-bold text-lg mb-3">اشترك في النشرة</h4>
                <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                  احصل على آخر الأخبار والمقالات مباشرة في بريدك الإلكتروني
                </p>
                <input
                  type="email"
                  placeholder="البريد الإلكتروني"
                  className="w-full p-3 text-gray-900 mb-4 text-sm rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button className="w-full bg-orange-500 text-white py-3 font-bold text-sm 
                                 hover:bg-orange-600 transition-colors rounded
                                 focus:outline-none focus:ring-2 focus:ring-orange-300">
                  اشتراك
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// Footer Component
const MagazineFooter = () => (
  <footer className="bg-white border-t border-gray-200">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <button className="group bg-gray-900 text-white px-12 py-4 font-bold text-lg 
                       hover:bg-orange-500 transition-all duration-300 transform hover:scale-105
                       focus:outline-none focus:ring-4 focus:ring-gray-300">
        <span className="flex items-center justify-center gap-3">
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          العودة إلى المجلة
        </span>
      </button>
    </div>
  </footer>
);

// Main Component
export const MagazinePageContent = () => {
  return (
    <div className="bg-white min-h-screen" dir="rtl">
      <MagazineHeader />
      <CoverSection />
      <MainContentGrid />
      <LatestNewsSection />
      <MagazineFooter />
    </div>
  );
};

export default MagazinePageContent;