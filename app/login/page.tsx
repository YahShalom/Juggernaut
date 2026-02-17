"use client";

import { useFormState } from "react-dom";
import { signInWithEmail } from "@/app/auth/actions";

export default function LoginPage() {
  const [state, formAction] = useFormState(signInWithEmail, { message: "" });

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input
        name="email"
        type="email"
        placeholder="you@example.com"
        required
        className="border p-2"
      />

      <button type="submit" className="bg-purple-600 text-white p-2">
        Sign In with Email
      </button>

      {state?.message && (
        <p className="text-sm text-yellow-500">{state.message}</p>
      )}
    </form>
  );
}