import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/dal';

export async function GET(request: NextRequest) {
  try {
    const { isAuth, session } = await verifySession();

    if (isAuth && session?.user) {
      // Fetch author data from Strapi if user is authenticated
      let authorData = null;

      try {
        const user = session.user as any; // Type assertion for now
        if (session.jwt && user?.email) {
          const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
          const response = await fetch(`${strapiUrl}/api/authors?filters[email][$eq]=${user.email}`, {
            headers: {
              'Authorization': `Bearer ${session.jwt}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const result = await response.json();
            console.log('Full Strapi result:', JSON.stringify(result, null, 2));
            if (result.data && result.data.length > 0) {
              authorData = result.data[0];
              console.log('Found author data for user:', user.email);
              console.log('Author data from Strapi:', JSON.stringify(authorData, null, 2));
              console.log('Author attributes:', JSON.stringify(authorData.attributes || authorData, null, 2));
            } else {
              console.log('No author data found for user:', user.email);
            }
          } else {
            console.log('Strapi response not ok:', response.status, response.statusText);
          }
        }
      } catch (authorError) {
        console.error('Error fetching author data:', authorError);
        // Don't fail the auth verification if author fetch fails
      }

      return NextResponse.json({
        isAuthenticated: true,
        user: session.user,
        author: authorData,
      });
    } else {
      return NextResponse.json({
        isAuthenticated: false,
        user: null,
        author: null,
      });
    }
  } catch (error) {
    console.error("Auth verification error:", error);
    return NextResponse.json({
      isAuthenticated: false,
      user: null,
      author: null,
    });
  }
}
