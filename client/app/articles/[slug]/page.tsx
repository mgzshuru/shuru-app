import { notFound } from "next/navigation"
import { getArticleBySlug } from "@/lib/strapi-client"
import { ArticleDetail } from "@/app/articles/article-design"
import type { Article } from "@/lib/types"

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  try {
    // Await params in Next.js 15
    const { slug } = await params;
    console.log('🔍 Fetching article with slug:', slug);
    
    // Handle the API call with proper error handling
    let response;
    try {
      response = await getArticleBySlug(slug);
      console.log('📦 Raw response received:', !!response);
    } catch (apiError) {
      console.error('🚨 API Error:', apiError);
      
      // If it's a 404 from Strapi, show not found
      if (apiError instanceof Error && apiError.message.includes('404')) {
        console.log('📄 Article not found in Strapi (404)');
        notFound();
      }
      
      // For other errors, log and show not found
      console.error('💥 Unexpected API error:', apiError);
      notFound();
    }
    
    console.log('📦 Response structure check:', {
      hasResponse: !!response,
      hasData: !!response?.data,
      isDataArray: Array.isArray(response?.data),
      dataLength: Array.isArray(response?.data) ? response.data.length : 'not array',
      responseKeys: response ? Object.keys(response) : 'no response'
    });

    // Check if response exists
    if (!response) {
      console.log('❌ No response received');
      notFound();
    }

    // Check different possible response structures
    let rawData = null;
    let articleData = null;

    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      // Strapi v4 structure: { data: [{ id, attributes: {...} }] }
      rawData = response.data[0];
      
      // Check if it has attributes (Strapi v4) or is direct data (Strapi v5)
      if (rawData.attributes) {
        articleData = rawData.attributes;
        console.log('📝 Using Strapi v4 structure with attributes');
      } else {
        articleData = rawData;
        console.log('📝 Using Strapi v5 structure without attributes');
      }
    } else if (response.data && !Array.isArray(response.data)) {
      // Strapi v5 structure: { data: { id, title, ... } }
      rawData = response.data;
      articleData = response.data;
      console.log('📝 Using Strapi v5 structure');
    } else if (
      response &&
      typeof response === "object" &&
      "title" in response &&
      (!("data" in response) || !Array.isArray((response as any).data))
    ) {
      // Direct object structure: { id, title, ... }
      rawData = response;
      articleData = response;
      console.log('📝 Using direct object structure');
    } else if (response.data && Array.isArray(response.data) && response.data.length === 0) {
      console.log('📭 Empty data array - article not found');
      notFound();
    }

    console.log('🗂️ Raw data keys:', rawData ? Object.keys(rawData) : 'no raw data');
    console.log('📄 Article data keys:', articleData ? Object.keys(articleData) : 'no article data');
    console.log('🔍 Article data preview:', articleData ? { 
      title: articleData.title, 
      slug: articleData.slug,
      hasBlocks: !!articleData.blocks,
      hasCoverImage: !!articleData.cover_image
    } : 'no data');

    if (!articleData || !articleData.title) {
      console.log('❌ No valid article data found or missing title');
      console.log('Available data:', articleData);
      notFound();
    }

    // Safely transform the article data
    const article: Article = {
      id: (rawData as any)?.id || articleData?.id || 0,
      documentId: (rawData as any)?.documentId || articleData?.documentId || "",
      title: articleData.title || "",
      description: articleData.description || articleData.excerpt || "",
      slug: articleData.slug || slug,
      createdAt: articleData.createdAt || "",
      updatedAt: articleData.updatedAt || "",
      publishedAt: articleData.publishedAt || "",
      publish_date: articleData.publish_date || articleData.publishedAt || "",
      is_featured: articleData.is_featured || false,
      
      // Safely handle cover_image - check multiple possible structures
      cover_image: (() => {
        const coverImg = articleData.cover_image;
        if (!coverImg) return undefined;
        
        // Strapi v4: cover_image.data.attributes
        if (coverImg.data?.attributes) {
          return {
            id: coverImg.data.id || 0,
            documentId: coverImg.data.documentId || "",
            name: coverImg.data.attributes.name || "",
            alternativeText: coverImg.data.attributes.alternativeText || "",
            url: coverImg.data.attributes.url || "",
            width: coverImg.data.attributes.width || 0,
            height: coverImg.data.attributes.height || 0,
          };
        }
        
        // Strapi v5: cover_image direct object
        if (coverImg.url) {
          return {
            id: coverImg.id || 0,
            documentId: coverImg.documentId || "",
            name: coverImg.name || "",
            alternativeText: coverImg.alternativeText || "",
            url: coverImg.url || "",
            width: coverImg.width || 0,
            height: coverImg.height || 0,
          };
        }
        
        return undefined;
      })(),
      
      // Safely handle category
      category: (() => {
        const cat = articleData.category;
        if (!cat) return undefined;
        
        // Strapi v4: category.data.attributes
        if (cat.data?.attributes) {
          return {
            id: cat.data.id || 0,
            documentId: cat.data.documentId || "",
            name: cat.data.attributes.name || "",
            slug: cat.data.attributes.slug || "",
            description: cat.data.attributes.description,
            SEO: cat.data.attributes.SEO ? {
              id: cat.data.attributes.SEO.id || 0,
              meta_title: cat.data.attributes.SEO.meta_title || "",
              meta_description: cat.data.attributes.SEO.meta_description || "",
            } : undefined,
          };
        }
        
        // Strapi v5: category direct object
        if (cat.name) {
          return {
            id: cat.id || 0,
            documentId: cat.documentId || "",
            name: cat.name || "",
            slug: cat.slug || "",
            description: cat.description,
            SEO: cat.SEO ? {
              id: cat.SEO.id || 0,
              meta_title: cat.SEO.meta_title || "",
              meta_description: cat.SEO.meta_description || "",
            } : undefined,
          };
        }
        
        return undefined;
      })(),
      
      // Safely handle author
      author: (() => {
        const auth = articleData.author;
        if (!auth) return undefined;
        
        // Strapi v4: author.data.attributes
        if (auth.data?.attributes) {
          const authData = auth.data.attributes;
          return {
            id: auth.data.id || 0,
            documentId: auth.data.documentId || "",
            name: authData.name || "",
            email: authData.email || "",
            jobTitle: authData.jobTitle,
            organization: authData.organization,
            phone_number: authData.phone_number,
            linkedin_url: authData.linkedin_url,
            createdAt: authData.createdAt || "",
            updatedAt: authData.updatedAt || "",
            publishedAt: authData.publishedAt,
            avatar: authData.avatar?.data?.attributes ? {
              id: authData.avatar.data.id || 0,
              documentId: authData.avatar.data.documentId || "",
              url: authData.avatar.data.attributes.url || "",
              alternativeText: authData.avatar.data.attributes.alternativeText || "",
              width: authData.avatar.data.attributes.width || 0,
              height: authData.avatar.data.attributes.height || 0,
            } : undefined,
          };
        }
        
        // Strapi v5: author direct object
        if (auth.name) {
          return {
            id: auth.id || 0,
            documentId: auth.documentId || "",
            name: auth.name || "",
            email: auth.email || "",
            jobTitle: auth.jobTitle,
            organization: auth.organization,
            phone_number: auth.phone_number,
            linkedin_url: auth.linkedin_url,
            createdAt: auth.createdAt || "",
            updatedAt: auth.updatedAt || "",
            publishedAt: auth.publishedAt,
            avatar: auth.avatar?.url ? {
              id: auth.avatar.id || 0,
              documentId: auth.avatar.documentId || "",
              url: auth.avatar.url || "",
              alternativeText: auth.avatar.alternativeText || "",
              width: auth.avatar.width || 0,
              height: auth.avatar.height || 0,
            } : undefined,
          };
        }
        
        return undefined;
      })(),
      
      // Handle blocks
      blocks: articleData.blocks || [],
      
      // Handle SEO
      SEO: articleData.SEO ? {
        id: articleData.SEO.id || 0,
        meta_title: articleData.SEO.meta_title || "",
        meta_description: articleData.SEO.meta_description || "",
      } : undefined,
      
      // Handle magazine_issues and newsletters
      magazine_issues: articleData.magazine_issues || [],
      newsletters: articleData.newsletters || [],
    };

    console.log('✅ Successfully transformed article:', article.title);
    return <ArticleDetail article={article} />;
    
  } catch (error) {
    console.error('💥 Unexpected error in ArticlePage:', error);
    
    // If it's a Next.js error, let it bubble up
    if (error instanceof Error && error.message.includes('NEXT_')) {
      throw error;
    }
    
    notFound();
  }
}

export async function generateMetadata({ params }: ArticlePageProps) {
  try {
    // Await params in Next.js 15
    const { slug } = await params;
    console.log('🏷️ Generating metadata for slug:', slug);
    
    let response;
    try {
      response = await getArticleBySlug(slug);
    } catch (apiError) {
      console.log('❌ API error in metadata generation:', apiError);
      return { 
        title: "Article Not Found",
        description: "The requested article could not be found."
      };
    }

    if (!response) {
      console.log('❌ No response for metadata');
      return { 
        title: "Article Not Found",
        description: "The requested article could not be found."
      };
    }

    // Handle different response structures
    let articleData = null;
    
    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      const rawData = response.data[0];
      articleData = rawData.attributes || rawData;
    } else if (response.data && !Array.isArray(response.data)) {
      articleData = response.data;
    } else if (
      response &&
      typeof response === "object" &&
      "title" in response &&
      (!("data" in response) || !Array.isArray((response as any).data))
    ) {
      articleData = response;
    }

    if (!articleData) {
      console.log('❌ No article data for metadata');
      return { 
        title: "Article Not Found",
        description: "The requested article could not be found."
      };
    }

    const title = articleData.SEO?.meta_title || articleData.title || "Article";
    const description = articleData.SEO?.meta_description || articleData.description || articleData.excerpt || "";

    // Handle cover image URL
    let imageUrl = null;
    const coverImg = articleData.cover_image;
    
    if (coverImg?.data?.attributes?.url) {
      // Strapi v4
      imageUrl = coverImg.data.attributes.url;
    } else if (coverImg?.url) {
      // Strapi v5
      imageUrl = coverImg.url;
    }

    if (imageUrl && imageUrl.startsWith('/')) {
      imageUrl = `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${imageUrl}`;
    }

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: imageUrl ? [{
          url: imageUrl,
          width: coverImg?.data?.attributes?.width || coverImg?.width || 1200,
          height: coverImg?.data?.attributes?.height || coverImg?.height || 630,
          alt: coverImg?.data?.attributes?.alternativeText || coverImg?.alternativeText || title,
        }] : undefined,
      },
    };
  } catch (error) {
    console.error('💥 Error generating metadata:', error);
    return {
      title: "Error Loading Article",
      description: "An error occurred while loading the article."
    };
  }
}