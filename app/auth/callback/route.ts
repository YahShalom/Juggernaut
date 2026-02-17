import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  console.log("CALLBACK URL:", request.url);
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const workspace = searchParams.get("workspace") ?? "";

  if (!code) return NextResponse.redirect(`${origin}/auth/login?error=missing_code`);

  const supabase = createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) return NextResponse.redirect(`${origin}/auth/login?error=exchange_failed`);

  return NextResponse.redirect(`${origin}/?workspace=${encodeURIComponent(workspace)}`);
}
