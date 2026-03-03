import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type CallbackSearchParams = {
  code?: string;
  token_hash?: string;
  type?: "recovery" | "email" | "signup" | string;
  next?: string;
  error?: string;
  error_description?: string;
};

function getSafeNext(next?: string) {
  if (!next || !next.startsWith("/")) return "/usage";
  return next;
}

export default async function CallbackPage({
  searchParams,
}: {
  searchParams: Promise<CallbackSearchParams>;
}) {
  const params = await searchParams;
  const { code, token_hash, type, error } = params;

  if (error) {
    redirect(`/login?error=${encodeURIComponent("Authentication failed.")}`);
  }

  const nextPath = getSafeNext(params.next);
  const supabase = await createClient();

  if (code) {
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(
      code
    );
    if (exchangeError) {
      redirect(`/login?error=${encodeURIComponent(exchangeError.message)}`);
    }
    redirect(nextPath);
  }

  if (token_hash && type) {
    const { error: verifyError } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as "recovery" | "email" | "signup",
    });
    if (verifyError) {
      redirect(`/login?error=${encodeURIComponent(verifyError.message)}`);
    }
    redirect(nextPath);
  }

  redirect("/login");
}
