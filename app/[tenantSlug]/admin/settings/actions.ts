'use server';

import { createTenantedSupabaseServerClient } from '@/lib/supabase/tenanted-server';
import { revalidatePath } from 'next/cache';

export async function saveBrand(brand_json: any, tenantSlug: string) {
  const { supabase, tenantId } = await createTenantedSupabaseServerClient();
  const { data, error } = await supabase
    .from('tenants')
    .update({ brand_json })
    .eq('id', tenantId);

  if (error) {
    console.error('Error saving brand', error);
    return { success: false, error: error.message };
  }

  // Revalidate the path to see changes
  revalidatePath(`/${tenantSlug}/admin/settings`);

  return { success: true, data };
}
