'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { requireTech } from '@/lib/auth/roles';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import crypto from 'crypto';

function normalizeSlug(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function createTenant(formData: FormData) {
  await requireTech();

  const name = String(formData.get('name') ?? '').trim();
  const slugRaw = String(formData.get('slug') ?? '').trim();
  const slug = normalizeSlug(slugRaw || name);
  const plan = String(formData.get('plan') ?? 'free').trim() || 'free';

  if (!name || !slug) {
    throw new Error('NAME_AND_SLUG_REQUIRED');
  }

  const { data: tenant, error } = await supabaseAdmin
    .from('tenants')
    .insert({ name, slug, plan, status: 'active' })
    .select('id')
    .single();

  if (error) throw error;

  revalidatePath('/esa');
  redirect(`/esa/tenants/${tenant.id}`);
}

export async function inviteTenantMember(formData: FormData) {
  await requireTech();

  const tenantId = String(formData.get('tenant_id') ?? '');
  const email = String(formData.get('email') ?? '').trim();
  const role = String(formData.get('role') ?? 'viewer').trim();

  if (!tenantId || !email) throw new Error('TENANT_AND_EMAIL_REQUIRED');

  const token = crypto.randomBytes(24).toString('hex');
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  const createdBy = userData.user?.id ?? null;

  const { data, error } = await supabaseAdmin
    .from('tenant_invitations')
    .insert({ tenant_id: tenantId, email, role, token, created_by: createdBy })
    .select('id, token, email, role, expires_at')
    .single();

  if (error) throw error;

  // In production: send email via Opal/n8n or Supabase SMTP.
  // For now we just revalidate so the link appears in UI.
  revalidatePath(`/esa/tenants/${tenantId}`);
  return data;
}

export async function revokeInvite(formData: FormData) {
  await requireTech();
  const inviteId = String(formData.get('invite_id') ?? '');
  const tenantId = String(formData.get('tenant_id') ?? '');
  if (!inviteId) throw new Error('INVITE_ID_REQUIRED');
  const { error } = await supabaseAdmin
    .from('tenant_invitations')
    .update({ status: 'revoked' })
    .eq('id', inviteId);
  if (error) throw error;
  revalidatePath(`/esa/tenants/${tenantId}`);
}
