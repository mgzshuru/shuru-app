import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/dal';
import { getStrapiURL } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    // Verify user session
    const { isAuth, session } = await verifySession();

    if (!isAuth || !session?.jwt) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Make request to Strapi
    const strapiUrl = getStrapiURL();
    const response = await fetch(`${strapiUrl}/api/saved-articles/user`, {
      headers: {
        'Authorization': `Bearer ${session.jwt}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || 'Failed to fetch saved articles' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error in user saved articles API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
