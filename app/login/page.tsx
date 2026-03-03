"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { signInWithPassword, type AuthFormState } from "@/app/auth/actions";
import { Eye, EyeOff } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";

const initialState: AuthFormState = { ok: false };
const REMEMBER_EMAIL_KEY = "remembered_login_email";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");
  const [state, formAction, isPending] = useActionState(
    signInWithPassword,
    initialState
  );
  const [rememberMe, setRememberMe] = useState(true);
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(REMEMBER_EMAIL_KEY);
    if (saved) {
      setEmail(saved);
      setRememberMe(true);
    }
  }, []);

  const onRememberToggle = (checked: boolean) => {
    setRememberMe(checked);
    if (!checked) {
      localStorage.removeItem(REMEMBER_EMAIL_KEY);
    }
  };

  const onSubmitCapture = () => {
    if (rememberMe && email) {
      localStorage.setItem(REMEMBER_EMAIL_KEY, email.trim());
    } else if (!rememberMe) {
      localStorage.removeItem(REMEMBER_EMAIL_KEY);
    }
  };

  return (
    <AuthShell
      brand="Carai Agency | Caribbean Ai Agency Where Caribbean spirit meets intellegent design"
      brandClassName="text-2xl font-semibold tracking-normal text-white"
      title="ADMIN ESA"
      titleClassName="text-[hsl(45_100%_62%)]"
      subtitle="Your Enterprise SaaS Assistant. We handle the boilerplate so you can focus on your business,"
    >
      <Card className="border-[hsl(45_100%_58%_/_0.35)] bg-[var(--card)]/70 shadow-none">
        <CardHeader className="space-y-1 p-0 pb-5">
          <CardTitle className="text-2xl">Sign in</CardTitle>
          <CardDescription>Use your email and password.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <form
            action={formAction}
            onSubmitCapture={onSubmitCapture}
            className="mt-8 space-y-4"
          >
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={isPending}
              />
            </div>

            <div>
              <Label htmlFor="password" className="mb-1 block">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  disabled={isPending}
                  className="pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => onRememberToggle(Boolean(checked))}
                />
                <Label htmlFor="remember">Remember me</Label>
              </div>

              <Link
                href="/auth/forgot-password"
                className="text-sm font-medium text-[var(--accent)]"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-gradient-to-r from-[hsl(214_88%_38%)] via-[hsl(214_78%_44%)] to-[hsl(45_100%_52%)] text-white"
            >
              {isPending ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          {urlError || state?.error ? (
            <p className="mt-4 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
              {urlError ?? state.error}
            </p>
          ) : null}
        </CardContent>
      </Card>
    </AuthShell>
  );
}
