import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Always allow internal debug routes to pass through the middleware
  if (request.nextUrl.pathname.startsWith('/_debug')) {
    return NextResponse.next();
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|favicon.ico|_debug).*)",
  ],
};
