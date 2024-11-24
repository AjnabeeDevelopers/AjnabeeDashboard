import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  // If the user is logged in and tries to access the sign-in route, redirect to home
  if (token && url.pathname.startsWith('/sign-in')) {
    return NextResponse.redirect(new URL("/", request.url)); // Redirect to home page
  }

  // If the user is not logged in and tries to access the home page, redirect to sign-in
  if (!token && url.pathname === "/") {
    return NextResponse.redirect(new URL('/sign-in', request.url)); // Redirect to sign-in page
  }
  console.log(token)

  // Allow request to proceed if all checks pass
  return NextResponse.next();
}

// Specify the routes for middleware to apply
export const config = {
  matcher: ['/:path*'], // Applies to all routes
};
