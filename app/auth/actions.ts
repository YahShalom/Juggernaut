"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export type AuthFormState = {
  ok: boolean;
  message?: string;
  error?: string;
};

function getOriginFromHeaders(h: Headers) {
  const xfProto = h.get("x-forwarded-proto") ?? "https";
  const xfHost = h.get("x-forwarded-host") ?? h.get("host");
  return `${xfProto}://${xfHost}`;
}

export async function signInWithPassword(
  _prevState: AuthFormState | null,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { ok: false, error: "Email and password are required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  redirect("/usage");
}

export async function requestPasswordReset(
  _prevState: AuthFormState | null,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get("email") || "").trim();
  if (!email) return { ok: false, error: "Email is required." };

  const h = await headers();
  const origin = getOriginFromHeaders(h);
  const redirectTo = `${origin}/auth/callback?next=/auth/reset-password`;

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  return {
    ok: true,
    message:
      "If that email exists, a reset link has been sent. Check your inbox.",
  };
}
