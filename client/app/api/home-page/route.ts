import { NextRequest, NextResponse } from 'next/server';
import { getStrapiURL } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const baseUrl = getStrapiURL();
    const url = new URL(`${baseUrl}/api/home-page`);

    // Use deep populate to get all dynamic blocks and their relationships
    url.searchParams.append('populate', 'deep');

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      console.error('Strapi API error:', response.status, response.statusText);
      return NextResponse.json(
        { error: 'Failed to fetch home page data' },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Home page API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
