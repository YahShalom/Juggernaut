"use server";

import { createClient } from "@/lib/supabase/server";

export default async function CallbackPage({ searchParams }: any) {
  const params = searchParams || {};
  const code = params.code as string | undefined;
  const token_hash = params.token_hash as string | undefined;
  const type = params.type as string | undefined;
  const error = params.error as string | undefined;
  const error_code = params.error_code as string | undefined;
  const error_description = params.error_description as string | undefined;

  // Crash-safe rendering: always return a page with debug info
  try {
    if (error) {
      return (
        <div className="p-6">
          <h1 className="text-xl font-bold">Auth Callback - Error</h1>
          <pre className="mt-4 bg-gray-50 p-4 rounded">{JSON.stringify({ error, error_code, error_description, params }, null, 2)}</pre>
        </div>
      );
    }

    // If no exchange params present, just show the params
    if (!code && !token_hash) {
      return (
        <div className="p-6">
          <h1 className="text-xl font-bold">Auth Callback - No Code</h1>
          <pre className="mt-4 bg-gray-50 p-4 rounded">{JSON.stringify({ params }, null, 2)}</pre>
        </div>
      );
    }

    const supabase = await createClient();

    if (code) {
      const resp = await supabase.auth.exchangeCodeForSession(code);
      return (
        <div className="p-6">
          <h1 className="text-xl font-bold">Auth Callback - Code Exchange</h1>
          <pre className="mt-4 bg-gray-50 p-4 rounded">{JSON.stringify({ params, resp }, null, 2)}</pre>
        </div>
      );
    }

    // token_hash + type flow
    if (token_hash && type) {
      const resp = await (supabase.auth as any).verifyOtp({ token_hash, type });
      return (
        <div className="p-6">
          <h1 className="text-xl font-bold">Auth Callback - OTP Verify</h1>
          <pre className="mt-4 bg-gray-50 p-4 rounded">{JSON.stringify({ params, resp }, null, 2)}</pre>
        </div>
      );
    }

    return (
      <div className="p-6">
        <h1 className="text-xl font-bold">Auth Callback</h1>
        <pre className="mt-4 bg-gray-50 p-4 rounded">{JSON.stringify({ params }, null, 2)}</pre>
      </div>
    );
  } catch (e: any) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold">Auth Callback - Crash</h1>
        <pre className="mt-4 bg-red-50 p-4 rounded">{JSON.stringify({ error: String(e), params }, null, 2)}</pre>
      </div>
    );
  }
}
