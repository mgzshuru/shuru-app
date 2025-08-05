import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/dal';
import { getStrapiURL } from '@/lib/utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ articleId: string }> }
) {
  try {
    const { articleId } = await params;

    // Check user session (but don't require it)
    const { isAuth, session } = await verifySession();

    if (!isAuth || !session?.jwt) {
      return NextResponse.json({ saved: false });
    }

    // Make request to Strapi
    const strapiUrl = getStrapiURL();
    const response = await fetch(`${strapiUrl}/api/saved-articles/check/${articleId}`, {
      headers: {
        'Authorization': `Bearer ${session.jwt}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      return NextResponse.json({ saved: false });
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error in check save API:', error);
    return NextResponse.json({ saved: false });
  }
}
