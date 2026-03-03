import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center px-4">
      <section className="w-full rounded-2xl border border-[var(--border)] bg-[var(--card)]/90 p-8 text-center shadow-xl backdrop-blur-sm">
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-foreground)]">
          404
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
          This page could not be found
        </h1>
        <p className="mt-3 text-sm text-[var(--muted-foreground)]">
          The link may be outdated or the page may have moved.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-block rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary-foreground)]"
        >
          Go to login
        </Link>
      </section>
    </main>
  );
}
