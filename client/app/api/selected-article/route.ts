import { NextResponse } from 'next/server';
import { getSelectedArticles } from '@/lib/strapi-client';

export async function GET() {
  try {
    const data = await getSelectedArticles();

    if (!data) {
      return NextResponse.json({ data: null }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching selected articles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
