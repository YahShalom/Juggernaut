"use server";

import { createClient } from "@/lib/supabase/server";

export async function signInWithEmail(_: any, formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });

  if (error) {
    return { message: error.message };
  }

  return { message: "Check your email for login link." };
}