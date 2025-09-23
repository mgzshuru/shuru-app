import { NextRequest, NextResponse } from 'next/server';
import { getMostReadArticles } from '@/lib/strapi-client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    // Use the strapi-client function to get most read articles with proper population
    const mostViewedArticles = await getMostReadArticles(limit);

    console.log('Most viewed articles data:', mostViewedArticles);

    const response = {
      data: mostViewedArticles,
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