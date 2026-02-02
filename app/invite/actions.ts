'use server';

import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function acceptInvite(formData: FormData) {
  const token = String(formData.get('token') ?? '');
  if (!token) throw new Error('TOKEN_REQUIRED');

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) redirect('/login');

  const { data: invite, error } = await supabaseAdmin
    .from('tenant_invitations')
    .select('id, tenant_id, email, role, status, expires_at')
    .eq('token', token)
    .single();

  if (error || !invite) throw new Error('INVITE_NOT_FOUND');
  if (invite.status !== 'invited') throw new Error('INVITE_NOT_ACTIVE');
  if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
    await supabaseAdmin.from('tenant_invitations').update({ status: 'expired' }).eq('id', invite.id);
    throw new Error('INVITE_EXPIRED');
  }

  const userEmail = (user.email ?? '').toLowerCase();
  if (userEmail !== String(invite.email).toLowerCase()) {
    throw new Error('EMAIL_MISMATCH');
  }

  // Add membership (upsert)
  const { error: memErr } = await supabaseAdmin
    .from('tenant_members')
    .upsert({ tenant_id: invite.tenant_id, user_id: user.id, role: invite.role, status: 'active' });
  if (memErr) throw memErr;

  await supabaseAdmin
    .from('tenant_invitations')
    .update({ status: 'accepted', accepted_at: new Date().toISOString() })
    .eq('id', invite.id);

  // Send them to the tenant dashboard
  const { data: tenant } = await supabaseAdmin
    .from('tenants')
    .select('slug')
    .eq('id', invite.tenant_id)
    .single();

  redirect(`/${tenant?.slug ?? ''}`);
}
