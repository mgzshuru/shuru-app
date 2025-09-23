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

    // Fetch article views sorted by view count with populated article data
    const response = await fetch(
      `${getStrapiURL()}/api/article-views?sort[0]=views:desc&pagination[limit]=${limit}&populate[article][populate][cover_image][fields][0]=url&populate[article][populate][cover_image][fields][1]=alternativeText&populate[article][populate][categories][fields][0]=name&populate[article][populate][categories][fields][1]=slug&populate[article][populate][author][fields][0]=name&populate[article][fields][0]=title&populate[article][fields][1]=slug&populate[article][fields][2]=description&populate[article][fields][3]=publish_date&populate[article][fields][4]=documentId&fields[0]=views`,
      { headers }
    );

    if (!response.ok) {
      console.error('Strapi API error:', response.status, response.statusText);

      // If unauthorized or article-views don't exist, try to fetch regular articles as fallback
      if (response.status === 401 || response.status === 404) {
        console.log('Trying fallback: fetching regular articles without views sorting');
        const fallbackResponse = await fetch(
          `${getStrapiURL()}/api/articles?sort[0]=publishedAt:desc&pagination[limit]=${limit}&populate[cover_image][fields][0]=url&populate[cover_image][fields][1]=alternativeText&populate[categories][fields][0]=name&populate[categories][fields][1]=slug&populate[author][fields][0]=name&fields[0]=title&fields[1]=slug&fields[2]=description&fields[3]=publish_date&fields[4]=documentId`,
          { headers: { 'Content-Type': 'application/json' } }
        );

        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          return NextResponse.json(fallbackData);
        }
      }

      return NextResponse.json({ error: 'Failed to fetch most read articles' }, { status: 500 });
    }

    const data = await response.json();

    // Transform the data to extract articles with view counts
    const transformedData = {
      data: data.data?.map((item: any) => ({
        ...item.article,
        views: item.views
      })) || [],
      meta: data.meta
    };

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error fetching most read articles:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}