import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const url = new URL(req.url);

  // Supabase magic link typically includes ?code=...
  const code = url.searchParams.get("code");
  const tenantSlug = url.searchParams.get("tenantSlug") || "";

  if (!code) {
    return NextResponse.redirect(new URL("/?error=missing_code", url.origin));
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      new URL(`/auth/error?msg=${encodeURIComponent(error.message)}`, url.origin)
    );
  }

  // store tenant context
  if (tenantSlug) {
    const cookieStore = await cookies()
    cookieStore.set("esa_workspace", tenantSlug, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  }

  // send them into the tenant app
  return NextResponse.redirect(new URL(tenantSlug ? `/${tenantSlug}` : "/", url.origin));
}
