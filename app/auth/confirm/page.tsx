// app/auth/confirm/page.tsx
"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

export default function ConfirmPage() {
  const params = useSearchParams();
  const router = useRouter();

  const email = params.get("email") || "";
  const tenantSlug = params.get("tenantSlug") || params.get("tenantslug") || "";

  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  async function onVerify(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });

    setLoading(false);

    if (error) {
      setErr(error.message);
      return;
    }

    // after verification, send them into the tenant app
    router.push(tenantSlug ? `/${tenantSlug}` : "/");
  }

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 420, padding: 24, border: "1px solid #e5e7eb", borderRadius: 12 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Confirm sign-in</h1>
        <p style={{ marginBottom: 16, opacity: 0.8 }}>
          Enter the 6-digit code sent to <b>{email || "your email"}</b>
        </p>

        <form onSubmit={onVerify}>
          <label style={{ display: "block", fontSize: 14, marginBottom: 6 }}>Code</label>
          <input
            value={token}
            onChange={(e) => setToken(e.target.value)}
            inputMode="numeric"
            placeholder="123456"
            style={{ width: "100%", padding: 12, borderRadius: 10, border: "1px solid #d1d5db" }}
          />

          {err ? <p style={{ color: "crimson", marginTop: 10 }}>{err}</p> : null}

          <button
            type="submit"
            disabled={loading || !email}
            style={{
              width: "100%",
              marginTop: 14,
              padding: 12,
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Verifying..." : "Verify code"}
          </button>
        </form>
      </div>
    </div>
  );
}
