import 'server-only';

import { supabaseAdmin } from '@/lib/supabase/admin';

/**
 * Server-only tenant lookup by slug.
 *
 * NOTE: This uses the service-role admin client so tenant resolution works
 * consistently even while RLS policies are evolving.
 */
export async function lookupTenantBySlug(slug: string): Promise<{
  tenant: {
    id: string;
    slug: string;
    name: string | null;
    status: string | null;
    brand_json: any;
    plan: string | null;
  } | null;
  errorMessage: string | null;
}> {
  try {
    const { data: tenant, error } = await supabaseAdmin
      .from('tenants')
      .select('id, slug, name, status, brand_json, plan')
      .eq('slug', slug)
      .single();

    if (error || !tenant) {
      return {
        tenant: null,
        errorMessage: error?.message || `Tenant not found for slug: ${slug}`,
      };
    }

    return { tenant, errorMessage: null };
  } catch (e: any) {
    return { tenant: null, errorMessage: e?.message || 'Tenant lookup failed.' };
  }
}
