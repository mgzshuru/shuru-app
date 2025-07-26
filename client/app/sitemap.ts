import { MetadataRoute } from 'next'
import { getGlobal } from '@/lib/strapi-client'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.shurumag.com'

  // Get dynamic data from Strapi
  let articles: any[] = []
  let pages: any[] = []

  try {
    // Fetch articles from Strapi
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337'
    const articlesResponse = await fetch(`${strapiUrl}/api/articles?populate=*&pagination[pageSize]=100`, {
      next: { revalidate: 3600 } // Revalidate every hour
    })

    if (articlesResponse.ok) {
      const articlesData = await articlesResponse.json()
      articles = articlesData.data || []
    }

    // Fetch pages from Strapi if you have them
    const pagesResponse = await fetch(`${strapiUrl}/api/pages?populate=*&pagination[pageSize]=100`, {
      next: { revalidate: 3600 }
    })

    if (pagesResponse.ok) {
      const pagesData = await pagesResponse.json()
      pages = pagesData.data || []
    }
  } catch (error) {
    console.error('Error fetching data for sitemap:', error)
  }

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/subscribe`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
  ]

  // Dynamic article pages
  const articlePages = articles.map((article) => ({
    url: `${baseUrl}/articles/${article.attributes?.slug || article.id}`,
    lastModified: new Date(article.attributes?.updatedAt || article.attributes?.publishedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Dynamic pages
  const dynamicPages = pages.map((page) => ({
    url: `${baseUrl}/p/${page.attributes?.slug || page.id}`,
    lastModified: new Date(page.attributes?.updatedAt || page.attributes?.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...articlePages, ...dynamicPages]
}
