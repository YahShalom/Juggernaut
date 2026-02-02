import 'server-only';

import { createSupabaseServerClient } from '@/lib/supabase/server';

export type EsaRole = 'viewer' | 'staff' | 'admin' | 'owner';

export async function getCurrentUserOrNull() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

export async function isTech(): Promise<boolean> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) return false;

  const { data: roleRow, error } = await supabase
    .from('global_roles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  if (error) return false;
  return roleRow?.role === 'tech';
}

export async function requireTech(): Promise<void> {
  const ok = await isTech();
  if (!ok) {
    // Throwing lets server components/actions surface a 500; we'll catch in pages where needed.
    throw new Error('TECH_ONLY');
  }
}
