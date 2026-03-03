'use server';

import { createTenantedSupabaseServerClient } from '@/lib/supabase/tenanted-server';
import { revalidatePath } from 'next/cache';

export async function saveOffering(offeringData: any, tenantSlug: string) {
  const { supabase, tenantId } = await createTenantedSupabaseServerClient();
  const { data, error } = await supabase
    .from('offerings')
    .upsert([{ ...offeringData, type: 'fashion', tenant_id: tenantId }]);

  if (error) {
    console.error('Error saving offering', error);
    return { success: false, error: error.message };
  }

  revalidatePath(`/${tenantSlug}/admin/fashion/offerings`);
  return { success: true, data };
}

export async function deleteOffering(offeringId: any, tenantSlug: string) {
  const { supabase } = await createTenantedSupabaseServerClient();
  const { data, error } = await supabase
    .from('offerings')
    .delete()
    .eq('id', offeringId);

  if (error) {
    console.error('Error deleting offering', error);
    return { success: false, error: error.message };
  }

  revalidatePath(`/${tenantSlug}/admin/fashion/offerings`);
  return { success: true, data };
}
