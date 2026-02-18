"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export async function signInWithEmail(prevState: any, formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  if (!email) {
    return { ok: false, step: "validation", message: "Email required" };
  }

  const h = await headers();
  const xfProto = h.get("x-forwarded-proto") ?? "https";
  const xfHost = h.get("x-forwarded-host") ?? h.get("host");
  const origin = `${xfProto}://${xfHost}`;
  const redirectTo = `${origin}/auth/callback`;

  console.log("[signInWithEmail] START", {
    email,
    redirectTo,
    origin,
    xfProto,
    xfHost,
  });

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: redirectTo },
  });

  console.log("[signInWithEmail] RESULT", {
    ok: !error,
    error: error?.message || null,
    step: error ? "otp_error" : "otp_sent",
  });

  if (error) {
    return {
      ok: false,
      step: "otp_error",
      message: error.message,
      debug: { origin, xfProto, xfHost, redirectTo },
    };
  }

  return {
    ok: true,
    step: "otp_sent",
    message: "Check your email for login link.",
    redirectTo,
    debug: { origin, xfProto, xfHost, redirectTo },
  };
}