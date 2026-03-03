
'use server';

import { createTenantedSupabaseServerClient } from '@/lib/supabase/tenanted-server';
import { revalidatePath } from 'next/cache';
import { requireTenantUserRole } from '@/lib/auth/guard';

// Category Actions

export async function createCategory(formData: FormData) {
  const name = formData.get('name') as string;
  const tenantSlug = formData.get('tenantSlug') as string;

  await requireTenantUserRole({
    tenantSlug,
    roles: ['owner', 'admin'],
  });

  const { supabase, tenantId } = await createTenantedSupabaseServerClient();
  const { data, error } = await supabase
    .from('hair_style_categories')
    .insert([{ category_name: name, tenant_id: tenantId }])
    .select();

  if (error) {
    console.error('Error creating category:', error);
    return { success: false, error: error.message };
  }

  revalidatePath(`/${tenantSlug}/admin/atelier-salon/hair-styles`);
  return { success: true, data };
}

export async function deleteCategory(formData: FormData) {
  const id = Number(formData.get('id'));
  const tenantSlug = formData.get('tenantSlug') as string;

  await requireTenantUserRole({
    tenantSlug,
    roles: ['owner', 'admin'],
  });

  const { supabase } = await createTenantedSupabaseServerClient();
  const { error } = await supabase.from('hair_style_categories').delete().eq('id', id);

  if (error) {
    console.error('Error deleting category:', error);
    return { success: false, error: error.message };
  }

  revalidatePath(`/${tenantSlug}/admin/atelier-salon/hair-styles`);
  return { success: true };
}

// Hair Style Actions

export async function saveHairStyle(formData: FormData) {
    const tenantSlug = formData.get('tenantSlug') as string;
    await requireTenantUserRole({
        tenantSlug,
        roles: ['owner', 'admin', 'tech'],
    });

    const { supabase, tenantId } = await createTenantedSupabaseServerClient();

    const hairStyleData = {
        id: formData.get('id') ? Number(formData.get('id')) : undefined,
        style_name: formData.get('style_name') as string,
        description: formData.get('description') as string,
        category_id: Number(formData.get('category_id')),
        image_url: formData.get('image_url') as string,
        tenant_id: tenantId,
    };
    
    // Basic validation
    if (!hairStyleData.style_name || !hairStyleData.category_id) {
        return { success: false, error: "Style name and category are required." };
    }

    const { data, error } = await supabase
        .from('hair_styles')
        .upsert(hairStyleData)
        .select();

    if (error) {
        console.error('Error saving hair style:', error);
        return { success: false, error: error.message };
    }

    revalidatePath(`/${tenantSlug}/admin/atelier-salon/hair-styles`);
    return { success: true, data: data?.[0] };
}


export async function deleteHairStyle(formData: FormData) {
  const id = Number(formData.get('id'));
  const tenantSlug = formData.get('tenantSlug') as string;
  
  await requireTenantUserRole({
    tenantSlug,
    roles: ['owner', 'admin', 'tech'],
  });

  if (!id) {
    return { success: false, error: 'Hair Style ID is required.' };
  }

  const { supabase } = await createTenantedSupabaseServerClient();
  const { error } = await supabase.from('hair_styles').delete().eq('id', id);

  if (error) {
    console.error('Error deleting hair style:', error);
    return { success: false, error: error.message };
  }

  revalidatePath(`/${tenantSlug}/admin/atelier-salon/hair-styles`);
  return { success: true };
}
