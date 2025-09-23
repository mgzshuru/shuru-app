import { NextRequest, NextResponse } from 'next/server';
import { getStrapiURL } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '10';

    const response = await fetch(
      `${getStrapiURL()}/api/articles?sort[0]=views:desc&pagination[limit]=${limit}&populate[cover_image][fields][0]=url&populate[cover_image][fields][1]=alternativeText&populate[categories][fields][0]=name&populate[categories][fields][1]=slug&populate[author][fields][0]=name&fields[0]=title&fields[1]=slug&fields[2]=description&fields[3]=views&fields[4]=publish_date&fields[5]=documentId`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error('Strapi API error:', response.status, response.statusText);
      return NextResponse.json({ error: 'Failed to fetch most read articles' }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching most read articles:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}