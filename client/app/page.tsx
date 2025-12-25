import { HomePageBlocksRenderer } from '@/lib/home-blocks';
import { fetchHomePageData } from '@/lib/strapi-client'
import { getArticlesOptimized, getAllCategories } from '@/lib/strapi-optimized';
import { getStrapiMedia } from '@/components/custom/strapi-image';
// import Link from 'next/link';

// Force static generation
// export const dynamic = 'force-static'
export const revalidate = 3600 // Revalidate every hour

export default async function Home() {
  try {
    // Fetch home page data and articles in parallel
    const [homePageData, articlesResponse, categoriesResponse] = await Promise.all([
      fetchHomePageData().catch(() => null), // Graceful fallback
      getArticlesOptimized({ pageSize: 20 }).catch(() => ({ data: [], meta: { total: 0 } })),
      getAllCategories().catch(() => ({ data: [] }))
    ]);

    const articles = Array.isArray(articlesResponse.data) ? articlesResponse.data : [];
    const categories = Array.isArray(categoriesResponse.data) ? categoriesResponse.data : [];

    // Extract hero section data for preloading
    const heroBlock = homePageData?.blocks?.find((b: any) => b.__component === 'home.hero-complex-section');
    const heroImagesSet = new Set<string>();

    if (heroBlock) {
      // Preload featured article image
      if (heroBlock.featuredArticle?.cover_image?.url) {
        const imgUrl = getStrapiMedia(heroBlock.featuredArticle.cover_image.url);
        if (imgUrl) heroImagesSet.add(imgUrl);
      }

      // Preload most read articles images
      heroBlock.mostReadArticles?.slice(0, 4).forEach((article: any) => {
        if (article.cover_image?.url) {
          const imgUrl = getStrapiMedia(article.cover_image.url);
          if (imgUrl) heroImagesSet.add(imgUrl);
        }
      });
    }

    // Preload selected articles images from first 4 articles
    articles.slice(0, 4).forEach((article: any) => {
      if (article.cover_image?.url) {
        const imgUrl = getStrapiMedia(article.cover_image.url);
        if (imgUrl) {
          heroImagesSet.add(imgUrl);
        }
      }
    });

    const heroImages = Array.from(heroImagesSet);

    return (
      <>
        {/* Preload critical hero images */}
        {heroImages.slice(0, 8).map((imgUrl, index) => (
          <link
            key={imgUrl}
            rel="preload"
            as="image"
            href={imgUrl}
            // @ts-ignore
            fetchPriority={index === 0 ? "high" : "low"}
          />
        ))}

        {/* Prefetch APIs */}
        <link rel="prefetch" href="/api/selected-article" />
        <link rel="prefetch" href="/api/most-read-articles?limit=4" />

        <main className="min-h-screen bg-white">
          <HomePageBlocksRenderer
            blocks={homePageData?.blocks}
            articles={articles as any}
            categories={categories as any}
          />
        </main>
      </>
    );
  } catch (error) {
    console.error('Error loading home page:', error);

    // Fallback to a simple home page if everything fails
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-2xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">مرحباً بك في شروع</h1>
          <p className="text-lg text-gray-600 mb-8">
            المنصة الرقمية المتخصصة في مجالات إدارة المشاريع، القيادة، التحول الرقمي، والابتكار
          </p>
          <a
            href="/articles"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            استكشف المقالات
          </a>
        </div>
      </main>
    );
  }
}