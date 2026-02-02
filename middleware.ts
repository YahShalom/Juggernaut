import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // TODO: resolve tenant from hostname or path
  // Example: /t/[slug]/...
  const path = req.nextUrl.pathname;
  const match = path.match(/^\/t\/([^\/]+)/);
  const slug = match?.[1];

  if (slug) {
    // For now pass slug, then in server code translate slug->tenantId if needed
    res.headers.set("x-tenant-slug", slug);
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|images|assets).*)"],
};