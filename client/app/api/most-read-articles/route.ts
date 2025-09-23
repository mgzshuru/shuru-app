import { NextRequest, NextResponse } from 'next/server';
import { getStrapiURL } from '@/lib/utils';

interface Article {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  description: string;
  publish_date: string;
  publishedAt?: string;
  cover_image?: any;
  categories?: any[];
  author?: any;
  views: number;
}

interface ArticleView {
  id: number;
  views: number;
  article: Article | null;
}

interface StrapiResponse<T> {
  data: T[];
  meta: {
    pagination: {
      start: number;
      limit: number;
      total: number;
      pageCount?: number;
    };
  };
}

/**
 * Builds the request headers for Strapi API calls
 */
function buildHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const apiToken = process.env.STRAPI_API_TOKEN;
  if (apiToken && apiToken !== 'your-strapi-api-token-here') {
    headers['Authorization'] = `Bearer ${apiToken}`;
  }

  return headers;
}

/**
 * Fetches article views from Strapi with populated article data
 */
async function fetchArticleViews(headers: Record<string, string>): Promise<StrapiResponse<ArticleView> | null> {
  try {
    const response = await fetch(
      `${getStrapiURL()}/api/article-views?sort[0]=views:desc&pagination[limit]=100&populate[article][populate][cover_image]=*&populate[article][populate][categories]=*&populate[article][populate][author]=*&populate[article]=*`,
      { headers }
    );

    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error('Error fetching article views:', error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    const headers = buildHeaders();

    // Only fetch article views - we don't need all articles for most viewed
    const viewsData = await fetchArticleViews(headers);

    let mostViewedArticles: Article[] = [];

    if (viewsData) {
      // Filter out article views with invalid article references
      const validArticleViews = viewsData.data.filter(
        (item: ArticleView) => item.article && item.article.id && item.views > 0
      );

      // Extract articles with views and sort by view count (descending)
      mostViewedArticles = validArticleViews
        .map((item: ArticleView) => ({
          ...item.article!,
          views: item.views
        }))
        .sort((a, b) => b.views - a.views);
    }

    // Apply pagination limit
    const finalArticles = mostViewedArticles.slice(0, limit);

    const response = {
      data: finalArticles,
      meta: {
        pagination: {
          start: 0,
          limit: limit,
          total: mostViewedArticles.length,
          pageCount: Math.ceil(mostViewedArticles.length / limit)
        }
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in most-read-articles API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}