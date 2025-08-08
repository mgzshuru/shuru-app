import { MetadataRoute } from 'next'
import { getAllArticles, getAllPages, getAllMagazineIssues, getAllCategories } from '@/lib/strapi-client'
import { getArticlesOptimized, getMagazineIssuesOptimized, getAllCategories as getCategoriesOptimized } from '@/lib/strapi-optimized'

// Force static generation for sitemap
export const dynamic = 'force-static'
export const revalidate = 3600 // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.shuru.sa'

  // Helper function to safely create dates
  const safeDate = (dateString?: string | null): Date => {
    if (!dateString) return new Date()
    const date = new Date(dateString)
    return isNaN(date.getTime()) ? new Date() : date
  }

  // Static routes
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/magazine`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/subscribe`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ]

  try {
    // Fetch all content in parallel
    const [articlesResult, magazineResult, categoriesResult] = await Promise.all([
      getArticlesOptimized({ pageSize: 1000 }).catch(() => getAllArticles()),
      getMagazineIssuesOptimized().catch(() => getAllMagazineIssues()),
      getCategoriesOptimized().catch(() => getAllCategories()),
    ])

    // Articles
    const articleRoutes = (articlesResult?.data || [])
      .filter((article: any) => article && article.slug) // Filter out invalid articles
      .map((article: any) => ({
        url: `${baseUrl}/articles/${article.slug}`,
        lastModified: safeDate(article.updatedAt || article.publishedAt),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }))

    // Magazine issues
    const magazineRoutes = (magazineResult?.data || [])
      .filter((issue: any) => issue && issue.slug) // Filter out invalid issues
      .map((issue: any) => ({
        url: `${baseUrl}/magazine/${issue.slug}`,
        lastModified: safeDate(issue.updatedAt || issue.publishedAt),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }))

    // Categories
    const categoryRoutes = (categoriesResult?.data || [])
      .filter((category: any) => category && category.slug) // Filter out invalid categories
      .map((category: any) => ({
        url: `${baseUrl}/categories/${category.slug}`,
        lastModified: safeDate(category.updatedAt || category.publishedAt),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }))

    // Try to fetch pages - handle gracefully if not available
    let pageRoutes: any[] = []
    try {
      const pagesResult = await getAllPages()
      if (pagesResult?.data && Array.isArray(pagesResult.data)) {
        pageRoutes = pagesResult.data
          .filter((page: any) => page && page.slug) // Filter out invalid pages
          .map((page: any) => ({
            url: `${baseUrl}/p/${page.slug}`,
            lastModified: safeDate(page.updatedAt || page.publishedAt),
            changeFrequency: 'monthly' as const,
            priority: 0.5,
          }))
      }
    } catch (error) {
      console.log('Pages not available for sitemap:', error instanceof Error ? error.message : 'Unknown error')
    }

    return [
      ...staticRoutes,
      ...articleRoutes,
      ...magazineRoutes,
      ...categoryRoutes,
      ...pageRoutes,
    ]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return at least static routes if dynamic content fails
    return staticRoutes
  }
}
