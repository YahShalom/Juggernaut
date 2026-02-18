"use client";

import { signInWithEmail } from "@/app/auth/actions";
import { useActionState } from "react";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(signInWithEmail, null);
  const [clientOrigin, setClientOrigin] = useState<string>("");
  const [redirectTo, setRedirectTo] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setClientOrigin(window.location.origin);
      setRedirectTo(`${window.location.origin}/auth/callback`);
    }
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* Debug Info Panel */}
      <div className="border border-yellow-400 bg-yellow-50 p-4 rounded">
        <h3 className="font-bold text-yellow-900 mb-2">🐛 Debug Info</h3>
        
        <div className="text-sm space-y-1 mb-3 font-mono">
          <div>
            <strong>Client Origin:</strong> <span className="text-blue-600">{clientOrigin || "loading..."}</span>
          </div>
          <div>
            <strong>Redirect URL:</strong> <span className="text-blue-600">{redirectTo || "loading..."}</span>
          </div>
        </div>

        <div>
          <strong>Form State (JSON):</strong>
          <pre className="bg-white p-2 border border-yellow-200 rounded text-xs overflow-auto max-h-40 mt-1">
            {state ? JSON.stringify(state, null, 2) : "null"}
          </pre>
        </div>

        <div className="mt-2 text-sm">
          <strong>Submit State:</strong>{" "}
          <span className={isPending ? "text-red-600 font-bold" : "text-green-600"}>
            {isPending ? "🔄 SUBMITTING..." : "idle"}
          </span>
        </div>
      </div>

      {/* Login Form */}
      <form action={formAction} className="flex flex-col gap-4">
        <input
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          className="border p-2"
          disabled={isPending}
        />

        <button
          type="submit"
          className="bg-purple-600 text-white p-2 disabled:opacity-50"
          disabled={isPending}
        >
          {isPending ? "Signing In..." : "Sign In with Email"}
        </button>
      </form>
    </div>
  );
}