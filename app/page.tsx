import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl items-center px-4 py-8">
      <section className="glass-panel w-full rounded-3xl border border-[var(--border)] px-6 py-7 md:px-8 md:py-8">
        <header className="flex items-center justify-between">
          <div className="text-sm font-semibold text-[var(--foreground)]">
            <span className="text-xl">Admin ESA.</span>{" "}
            <span className="text-[hsl(45_100%_56%)]">Carai Agency</span>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--foreground)]"
          >
            Login
            <ArrowRight className="h-4 w-4" />
          </Link>
        </header>

        <div className="mt-16 text-center">
          <h1 className="bg-gradient-to-r from-[hsl(214_88%_46%)] via-[hsl(212_84%_68%)] to-[hsl(45_100%_58%)] bg-clip-text text-6xl font-bold leading-none text-transparent md:text-7xl">
            Admin ESA
          </h1>
          <p className="mx-auto mt-8 max-w-md text-3xl leading-tight text-[var(--muted-foreground)] md:text-4xl">
            Your Enterprise SaaS Assistant. We handle the boilerplate so you can focus on your product.
          </p>

          <Link
            href="/login"
            className="btn-primary-gradient mt-10 inline-block rounded-2xl px-8 py-3 text-lg font-semibold shadow-lg"
          >
            Go to Login
          </Link>
        </div>

        <footer className="mt-16 text-center text-lg text-[var(--muted-foreground)]">
          © 2026 Admin ESA. All rights reserved.
        </footer>
      </section>
    </main>
  );
}
