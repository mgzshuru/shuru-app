import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/dal';

export async function GET(request: NextRequest) {
  try {
    const { isAuth, session } = await verifySession();

    if (isAuth && session?.user) {
      return NextResponse.json({
        isAuthenticated: true,
        user: session.user,
      });
    } else {
      return NextResponse.json({
        isAuthenticated: false,
        user: null,
      });
    }
  } catch (error) {
    return NextResponse.json({
      isAuthenticated: false,
      user: null,
    });
  }
}
