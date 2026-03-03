
import 'server-only';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getTenantContext } from '@/lib/tenant-context';

/**
 * Creates a Supabase server client that is MANDATORILY scoped to a tenant.
 * 
 * It first retrieves the tenant context. If the tenant ID is missing (either
 * not found or due to a resolution error), it throws an error.
 * This prevents any database operations from executing without a tenant scope.
 *
 * @returns An object containing the Supabase client and the resolved tenant ID.
 */
export async function createTenantedSupabaseServerClient() {
  const { tenant, errorMessage } = getTenantContext();

  // CRITICAL: Halt if tenant context is invalid
  if (errorMessage || !tenant?.id) {
    throw new Error(errorMessage || 'Tenant ID is missing. Cannot create a tenanted Supabase client.');
  }

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    // IMPORTANT: use the ANON key here so all queries respect RLS.
    // Use lib/supabase/admin.ts (service role) only for controlled server-only admin operations.
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );

  return {
    supabase,
    tenant,
    tenantId: tenant.id,
  };
}
