import { notFound } from "next/navigation"
import { getCategoryBySlug , getArticlesByCategory} from "@/lib/strapi-client"
import { CategoryHeader } from "../category/category-header"
import { CategoryPage } from "../category/category-page"
import { transformCategoryToPageData } from "@/lib/utils"


import type { Category } from "../category/type"
import type { Article } from "../category/type"
// import type { getArticleByCategory } from "@/lib/strapi-client"
interface CategoryPageProps {
    params: {
      category: string
    }
  }
  
  export default async function Page({ params }: CategoryPageProps) {
    const doc = await getCategoryBySlug(params.category)
    if (!doc) {
      notFound()
    }
  
    // Get articles for this category
    const articles = await getArticlesByCategory(params.category, 20)
    
    const category: Category = {
      id: doc.id,
      name: doc.name,
      slug: doc.slug,
      documentId: doc.documentId,
      description: doc.description,
      children_categories: doc.children_categories || []
    }
  
    // Add this mapping function (adjust field names as needed)
    function mapToArticle(doc: any): Article {
      return {
        id: doc.id,
        title: doc.title,
        slug: doc.slug,
        publish_date: doc.publish_date,
        is_featured: doc.is_featured,
        documentId: doc.documentId, // Add this line
        // ...add other fields as needed
      };
    }

    const articlesArray = (articles.data || []).map(mapToArticle);

    const pageData = {
      category,
      mainArticle: articlesArray[0] || null,
      sideArticles: articlesArray.slice(1, 5),
      bottomImages: articlesArray.slice(5, 9),
      latestNews: {
        title: "آخر الأخبار",
        items: articlesArray.slice(9, 15)
      }
    };
  
    return (
      <>
        <CategoryHeader category={category} />
        <CategoryPage data={pageData} />
      </>
    )
  }
  
  export async function generateMetadata({ params }: CategoryPageProps) {
    const category = await getCategoryBySlug(params.category)
  
    if (!category) {
      return {
        title: "القسم غير موجود",
      }
    }
  
    return {
      title: category.SEO?.meta_title || category.name,
      description: category.SEO?.meta_description || category.description,
    }
  }