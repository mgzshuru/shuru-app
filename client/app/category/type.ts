// Strapi v5 response types
export interface StrapiResponse<T> {
    data: T[]
    meta: {
      pagination: {
        page: number
        pageSize: number
        pageCount: number
        total: number
      }
    }
  }
  
  export interface StrapiSingleResponse<T> {
    data: T
    meta: {}
  }
  
  // Content types
  export interface Article {
    id: number
    documentId: string
    title: string
    slug: string
    content?: string
    excerpt?: string
    publish_date: string
    is_featured: boolean
    cover_image?: {
      url: string
      alternativeText: string
      width: number
      height: number
    }
    category?: Category
  }
  
  export interface Category {
    id: number
    documentId: string
    name: string
    slug: string
    description?: string
    parent_category?: Category
    children_categories?: Category[]
    articles?: Article[]
    SEO?: {
      meta_title: string
      meta_description: string
    }
  }
  
  // Page data structure
  export interface CategoryPageData {
    category: Category
    mainArticle?: Article
    sideArticles: Article[]
    bottomImages: Article[]
    latestNews: {
      title: string
      items: Article[]
    }
  }
  