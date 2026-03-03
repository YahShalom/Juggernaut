'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createTenantedSupabaseServerClient } from '@/lib/supabase/tenanted-server';
import { resolveTenantContext } from '@/lib/tenant-context';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// The schema now expects a slug to resolve the tenant context for the action.
const SaveTryonSchema = z.object({
  tenantSlug: z.string(),
  hairStyleId: z.string().uuid(),
  appliedScale: z.coerce.number(),
  appliedOffsetX: z.coerce.number(),
  appliedOffsetY: z.coerce.number(),
  appliedRotation: z.coerce.number(),
  appliedOpacity: z.coerce.number(),
});

/**
 * Saves a new hair try-on record. This action is now tenant-aware.
 */
export async function saveHairTryon(formData: FormData) {
  const validatedFields = SaveTryonSchema.safeParse({
    tenantSlug: formData.get('tenantSlug'),
    hairStyleId: formData.get('hairStyleId'),
    appliedScale: formData.get('appliedScale'),
    appliedOffsetX: formData.get('appliedOffsetX'),
    appliedOffsetY: formData.get('appliedOffsetY'),
    appliedRotation: formData.get('appliedRotation'),
    appliedOpacity: formData.get('appliedOpacity'),
  });

  if (!validatedFields.success) {
    console.error('Validation failed:', validatedFields.error.flatten().fieldErrors);
    throw new Error('Invalid form data provided.');
  }

  const { tenantSlug, ...tryonData } = validatedFields.data;

  // 1. Resolve the tenant context for this specific action request.
  await resolveTenantContext(tenantSlug);

  // 2. Get user session and the mandatory tenanted Supabase client.
  // This will fail if the context resolution failed.
  const authClient = await createSupabaseServerClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) throw new Error('Authentication is required to save a try-on.');

  const { supabase, tenantId } = await createTenantedSupabaseServerClient();

  const selfieFile = formData.get('selfieFile') as File;
  if (!selfieFile || selfieFile.size === 0) {
    throw new Error('A selfie image is required.');
  }

  // 3. Upload selfie to private storage, now using tenantId from context.
  const selfiePath = `${tenantId}/${user.id}/${Date.now()}-${selfieFile.name}`;
  const { error: uploadError } = await supabase.storage
    .from('tryon-selfies')
    .upload(selfiePath, selfieFile);

  if (uploadError) {
    console.error('Storage Error:', uploadError);
    throw new Error('Failed to upload your selfie.');
  }

  // 4. Insert record, using tenantId from context.
  const { error: dbError } = await supabase.from('hair_tryons').insert({
    ...tryonData,
    tenant_id: tenantId, // tenantId is from the secure, server-side context
    user_id: user.id,
    hair_style_id: tryonData.hairStyleId,
    selfie_image_path: selfiePath,
  });

  if (dbError) {
    console.error('Database Error:', dbError);
    // Attempt to clean up the orphaned file
    await supabase.storage.from('tryon-selfies').remove([selfiePath]);
    throw new Error('Failed to save your try-on session.');
  }

  revalidatePath('/[tenantSlug]/atelier/salon/tryon', 'page');

  return { success: true, selfiePath };
}
