import { createClient } from '@/lib/supabase/server';
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Always allow internal debug routes to pass through the middleware
  if (request.nextUrl.pathname.startsWith('/_debug')) {
    return NextResponse.next();
  }

  const supabase = await createClient();
  const { response } = await supabase.auth.getSession();
  return response;
}

export const config = {
  matcher: [
    "/((?!_next|favicon.ico|_debug).*)",
  ],
};
