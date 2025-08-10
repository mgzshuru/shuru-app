import { NextResponse } from 'next/server';
import { getSubmitPageCached } from '@/lib/strapi-optimized';

export async function GET() {
  try {
    const submitPageData = await getSubmitPageCached();

    if (!submitPageData) {
      return NextResponse.json(
        { error: 'Submit page content not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: submitPageData
    });
  } catch (error) {
    console.error('Error fetching submit page content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submit page content' },
      { status: 500 }
    );
  }
}
