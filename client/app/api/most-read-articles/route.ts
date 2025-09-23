import { NextRequest, NextResponse } from 'next/server';
import { getStrapiURL } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '10';

    // Check if we have an API token
    const apiToken = process.env.STRAPI_API_TOKEN;

    // Build headers conditionally
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (apiToken && apiToken !== 'your-strapi-api-token-here') {
      headers['Authorization'] = `Bearer ${apiToken}`;
    }

    // First, try to fetch article views with populated article data
    const viewsResponse = await fetch(
      `${getStrapiURL()}/api/article-views?sort[0]=views:desc&pagination[limit]=100&populate[article][populate][cover_image][fields][0]=url&populate[article][populate][cover_image][fields][1]=alternativeText&populate[article][populate][categories][fields][0]=name&populate[article][populate][categories][fields][1]=slug&populate[article][populate][author][fields][0]=name&populate[article][fields][0]=title&populate[article][fields][1]=slug&populate[article][fields][2]=description&populate[article][fields][3]=publish_date&populate[article][fields][4]=documentId&fields[0]=views`,
      { headers }
    );

    // Also fetch all articles to include those without views
    const articlesResponse = await fetch(
      `${getStrapiURL()}/api/articles?sort[0]=publishedAt:desc&pagination[limit]=100&populate[cover_image][fields][0]=url&populate[cover_image][fields][1]=alternativeText&populate[categories][fields][0]=name&populate[categories][fields][1]=slug&populate[author][fields][0]=name&fields[0]=title&fields[1]=slug&fields[2]=description&fields[3]=publish_date&fields[4]=documentId`,
      { headers }
    );

    if (!articlesResponse.ok) {
      console.error('Strapi API error fetching articles:', articlesResponse.status, articlesResponse.statusText);
      return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
    }

    const articlesData = await articlesResponse.json();
    let combinedArticles: any[] = [];

    if (viewsResponse.ok) {
      // If we have views data, process it
      const viewsData = await viewsResponse.json();

      // Create articles with views
      const articlesWithViews = viewsData.data?.map((item: any) => ({
        ...item.article,
        views: item.views
      })) || [];

      // Get IDs of articles that have views
      const articlesWithViewsIds = new Set(articlesWithViews.map((article: any) => article.id));

      // Get articles without views
      const articlesWithoutViews = articlesData.data?.filter((article: any) =>
        !articlesWithViewsIds.has(article.id)
      ).map((article: any) => ({
        ...article,
        views: 0
      })) || [];

      // Combine and sort: articles with views first (sorted by views desc), then articles without views (sorted by date desc)
      combinedArticles = [
        ...articlesWithViews.sort((a: any, b: any) => (b.views || 0) - (a.views || 0)),
        ...articlesWithoutViews.sort((a: any, b: any) =>
          new Date(b.publishedAt || b.publish_date).getTime() - new Date(a.publishedAt || a.publish_date).getTime()
        )
      ];
    } else {
      // If no views data available, just use all articles with 0 views
      combinedArticles = articlesData.data?.map((article: any) => ({
        ...article,
        views: 0
      })) || [];
    }

    // Limit to requested number
    const limitNum = parseInt(limit);
    const finalArticles = combinedArticles.slice(0, limitNum);

    const transformedData = {
      data: finalArticles,
      meta: {
        ...articlesData.meta,
        pagination: {
          ...articlesData.meta?.pagination,
          total: combinedArticles.length,
          pageCount: Math.ceil(combinedArticles.length / limitNum)
        }
      }
    };

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error fetching most read articles:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}