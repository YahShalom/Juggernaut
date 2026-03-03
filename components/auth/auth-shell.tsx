import type { ReactNode } from "react";

export function AuthShell({
  children,
  brand,
  brandClassName,
  title,
  titleClassName,
  subtitle,
}: {
  children: ReactNode;
  brand?: string;
  brandClassName?: string;
  title: string;
  titleClassName?: string;
  subtitle: string;
}) {
  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center overflow-hidden px-4 py-12">
      <div className="pointer-events-none absolute inset-0">
        <svg
          className="absolute -left-40 top-[-10%] h-[520px] w-[520px] animate-orbit-slow opacity-60"
          viewBox="0 0 600 600"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="goldBlueA" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(45 100% 58%)" />
              <stop offset="55%" stopColor="hsl(210 82% 42%)" />
              <stop offset="100%" stopColor="hsl(45 92% 72%)" />
            </linearGradient>
          </defs>
          <circle cx="300" cy="300" r="180" fill="url(#goldBlueA)" opacity="0.24" />
          <circle cx="300" cy="300" r="120" fill="none" stroke="url(#goldBlueA)" strokeWidth="20" opacity="0.3" />
        </svg>

        <svg
          className="absolute -right-24 bottom-[-14%] h-[440px] w-[440px] animate-float-slow opacity-60"
          viewBox="0 0 500 500"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="goldBlueB" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(210 92% 62%)" />
              <stop offset="60%" stopColor="hsl(45 100% 66%)" />
              <stop offset="100%" stopColor="hsl(0 0% 100%)" />
            </linearGradient>
          </defs>
          <path
            d="M250 60c88 0 160 72 160 160s-72 220-160 220S60 308 60 220 162 60 250 60Z"
            fill="url(#goldBlueB)"
            opacity="0.22"
          />
        </svg>
      </div>

      <section className="relative z-10 grid w-full max-w-5xl overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)]/90 shadow-[0_25px_80px_hsl(210_82%_22%_/_0.28)] backdrop-blur-xl md:grid-cols-2">
        <aside className="hidden bg-gradient-to-br from-[hsl(210_82%_34%)] via-[hsl(211_70%_29%)] to-[hsl(42_100%_58%)] p-10 text-white md:block">
          <p className={`text-xs tracking-[0.08em] text-white/90 ${brandClassName ?? ""}`}>
            {brand ?? "Admin ESA"}
          </p>
          <h1 className={`mt-5 text-4xl font-semibold leading-tight ${titleClassName ?? ""}`}>
            {title}
          </h1>
          <p className="mt-4 max-w-sm text-sm text-white/85">{subtitle}</p>
          <div className="mt-10 rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-sm">
            Secure workspace access powered by Supabase Auth
          </div>
        </aside>
        <div className="p-8 md:p-10">{children}</div>
      </section>
    </main>
  );
}
