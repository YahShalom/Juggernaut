"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  requestPasswordReset,
  type AuthFormState,
} from "@/app/auth/actions";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: AuthFormState = { ok: false };

export default function ForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState(
    requestPasswordReset,
    initialState
  );

  return (
    <AuthShell
      title="Recover account access"
      subtitle="We will send a secure reset link to your registered email."
    >
      <Card className="border-[hsl(45_100%_58%_/_0.35)] bg-[var(--card)]/70 shadow-none">
        <CardHeader className="space-y-1 p-0 pb-5">
          <CardTitle className="text-2xl">Reset your password</CardTitle>
          <CardDescription>
            Enter your account email and we will send a password reset link.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <form action={formAction} className="space-y-4">
            <div>
              <Label htmlFor="email" className="mb-1 block">
                Email
              </Label>
              <Input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              disabled={isPending}
              />
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-gradient-to-r from-[hsl(214_88%_38%)] via-[hsl(214_78%_44%)] to-[hsl(45_100%_52%)] text-white"
            >
              {isPending ? "Sending..." : "Send reset link"}
            </Button>
          </form>

          {state?.error ? (
            <p className="mt-4 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
              {state.error}
            </p>
          ) : null}
          {state?.ok && state.message ? (
            <p className="mt-4 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300">
              {state.message}
            </p>
          ) : null}

          <Link
            href="/login"
            className="mt-6 inline-block text-sm font-medium text-[var(--accent)]"
          >
            Back to sign in
          </Link>
        </CardContent>
      </Card>
    </AuthShell>
  );
}
