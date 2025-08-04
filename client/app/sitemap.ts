import { MetadataRoute } from 'next'
import { getAllArticles, getAllPages, getAllMagazineIssues, getAllCategories } from '@/lib/strapi-client'
import { getArticlesOptimized, getMagazineIssuesOptimized, getAllCategories as getCategoriesOptimized } from '@/lib/strapi-optimized'

// Force static generation for sitemap
export const dynamic = 'force-static'
export const revalidate = 3600 // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.shuru.sa'

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
  ]

  try {
    // Fetch all content in parallel
    const [articlesResult, magazineResult, categoriesResult] = await Promise.all([
      getArticlesOptimized({ pageSize: 1000 }).catch(() => getAllArticles()),
      getMagazineIssuesOptimized().catch(() => getAllMagazineIssues()),
      getCategoriesOptimized().catch(() => getAllCategories()),
    ])

    // Articles
    const articleRoutes = (articlesResult?.data || []).map((article: any) => ({
      url: `${baseUrl}/articles/${article.slug}`,
      lastModified: new Date(article.updatedAt || article.publishedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

    // Magazine issues
    const magazineRoutes = (magazineResult?.data || []).map((issue: any) => ({
      url: `${baseUrl}/magazine/${issue.slug}`,
      lastModified: new Date(issue.updatedAt || issue.publishedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

    // Categories
    const categoryRoutes = (categoriesResult?.data || []).map((category: any) => ({
      url: `${baseUrl}/categories/${category.slug}`,
      lastModified: new Date(category.updatedAt || category.publishedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))

    // Try to fetch pages - this might not exist yet
    let pageRoutes: any[] = []
    try {
      const pagesResult = await getAllPages()
      pageRoutes = (pagesResult?.data || []).map((page: any) => ({
        url: `${baseUrl}/p/${page.slug}`,
        lastModified: new Date(page.updatedAt || page.publishedAt),
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      }))
    } catch (error) {
      console.log('Pages not available for sitemap')
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
