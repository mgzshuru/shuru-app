import { NextResponse } from 'next/server';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export async function GET() {
  try {
    const response = await fetch(`${STRAPI_URL}/api/categories?sort=name:asc`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch categories:', response.status, response.statusText);
      return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }

    const data = await response.json();

    // Extract category names from the response
    const categories = data.data.map((category: any) => ({
      id: category.id,
      name: category.name,
      slug: category.slug
    }));

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
