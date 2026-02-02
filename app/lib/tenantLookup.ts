'use client'

import { supabase } from '../../lib/supabase/browser'

export async function lookupTenantBySlug(slug: string) {
  console.log('Attempting to look up tenant with slug:', slug);

  // Query for tenants with the matching slug, without using .single()
  const { data, error } = await supabase
    .from('tenants')
    .select('id, slug, name, status')
    .eq('slug', slug);

  // Log the raw Supabase response for debugging
  console.log('Supabase response:', { data, error });

  if (error) {
    console.error('Supabase query failed. Full error:', error);
    return { tenant: null, errorMessage: 'Database query failed.' };
  }

  if (!data || data.length === 0) {
    console.warn(`No tenant found for slug: ${slug}`);
    return { tenant: null, errorMessage: 'Tenant not found' };
  }

  if (data.length > 1) {
    console.error(`Configuration error: ${data.length} tenants found for unique slug: ${slug}.`);
    return { tenant: null, errorMessage: 'Configuration error: Multiple tenants found.' };
  }

  // Exactly one tenant found
  return { tenant: data[0], errorMessage: null };
}
