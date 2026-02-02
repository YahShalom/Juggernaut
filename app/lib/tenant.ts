'use client';

/**
 * Resolves a tenant slug from the hostname.
 * e.g., "acme.adminesa.app" -> "acme"
 * @param hostname The window.location.hostname
 * @returns The tenant slug or null.
 */
export function resolveTenantFromHost(hostname: string): string | null {
  // This logic should be customized for your production domain.
  const parts = hostname.split('.');
  if (parts.length > 2 && parts[0] !== 'www') {
    // Example: perrydbeauty.adminesa.app -> "perrydbeauty"
    // Do not run on localhost
    if (parts[1] !== 'localhost') {
      return parts[0];
    }
  }
  return null;
}

/**
 * Normalizes a user-provided string into a valid tenant slug.
 * @param input The string to normalize.
 * @returns A safe slug.
 */
export function normalizeTenantSlug(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')       // Replace spaces with -
    .replace(/[^a-z0-9-]/g, ''); // Remove all non-alphanumeric characters except hyphens
}

/**
 * Persists the selected tenant slug to localStorage and a cookie.
 * @param slug The tenant slug to save.
 */
export function persistTenant(slug: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem("tenant_slug", slug);
    // Cookie is useful for server-side rendering or API routes if needed later
    document.cookie = `tenant_slug=${slug}; path=/; max-age=2592000; samesite=lax`; // 30 days
  }
}

/**
 * Reads the persisted tenant slug from localStorage or cookies.
 * @returns The slug or null if not found.
 */
export function readPersistedTenant(): string | null {
  if (typeof window !== 'undefined') {
    const fromLocalStorage = localStorage.getItem("tenant_slug");
    if (fromLocalStorage) {
      return fromLocalStorage;
    }

    const fromCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('tenant_slug='))
      ?.split('=')[1];
      
    if (fromCookie) {
        return fromCookie;
    }
  }
  return null;
}
