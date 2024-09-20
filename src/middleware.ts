import { NextRequest, NextResponse } from 'next/server';
import { NextRequestWithAuth } from 'next-auth/middleware';
import { getToken } from 'next-auth/jwt';
export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/dashboard/:path*', '/sign-in', '/sign-up', '/', '/verify/:path*'],
};

export async function middleware(request: NextRequestWithAuth) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;
  if (
    token &&
    (url.pathname.startsWith('/sign-in') ||
      url.pathname.startsWith('/sign-up'))
  ) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (
    !token &&
    url.pathname !== '/sign-in' &&
    url.pathname !== '/sign-up' &&
    !url.pathname.startsWith('/verify/')
  ) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}