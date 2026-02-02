'use client';

import { useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const tenantSlug = searchParams.get('tenant');

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-zinc-950 dark:text-zinc-50 flex flex-col justify-center items-center">
      <div className="max-w-md w-full mx-auto p-8">
        <div className="text-center mb-8">
          <div className="text-base sm:text-lg font-semibold tracking-wide text-gray-800 dark:text-zinc-100">
            Carai Agency | Caribbean AI Agency
          </div>
          <div className="text-sm text-gray-600 dark:text-zinc-400 mt-1">
            Where Caribbean Spirit Meets Intelligence
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-zinc-50 mt-5">Admin ESA</h1>
          <p className="text-gray-600 dark:text-zinc-400 mt-2">Sign in to your workspace</p>

          {tenantSlug ? (
            <p className="text-xs text-gray-500 mt-4">
              Signing in to: <span className="font-semibold text-gray-700">{tenantSlug}</span>
            </p>
          ) : null}
        </div>

        <div className="bg-white/90 dark:bg-zinc-900/70 backdrop-blur p-8 rounded-xl shadow-lg border border-gray-200 dark:border-zinc-800 text-sm text-zinc-600 dark:text-zinc-300">
          This page is reserved for the tenant login experience.
          If you intended to sign in, use the main sign-in form on the root page.
        </div>
      </div>
    </div>
  );
}
