import Link from 'next/link';
import { requireTech } from '@/lib/auth/roles';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { inviteTenantMember, revokeInvite } from '@/app/esa/tenants/actions';

export default async function TenantManagePage({ params }: { params: { tenantId: string } }) {
  await requireTech();

  const tenantId = params.tenantId;

  const { data: tenant } = await supabaseAdmin
    .from('tenants')
    .select('id, slug, name, plan, status')
    .eq('id', tenantId)
    .single();

  const { data: members } = await supabaseAdmin
    .from('tenant_members')
    .select('user_id, role, status, created_at')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false });

  const { data: invites } = await supabaseAdmin
    .from('tenant_invitations')
    .select('id, email, role, status, token, expires_at, created_at')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false });

  if (!tenant) {
    return <div className="text-sm">Tenant not found.</div>;
  }

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">{tenant.name}</h2>
        <p className="text-sm text-muted-foreground">
          Slug: <span className="font-mono">{tenant.slug}</span> • Plan: {tenant.plan ?? 'free'} • Status: {tenant.status ?? 'active'}
        </p>
        <div className="text-sm">
          <Link className="underline" href={`/${tenant.slug}/admin`}>Open tenant admin</Link>
        </div>
      </div>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold">Invite member</h3>
        <form action={inviteTenantMember} className="grid gap-3 rounded-lg border p-4 md:grid-cols-3">
          <input type="hidden" name="tenant_id" value={tenantId} />
          <input name="email" required className="rounded-md border px-3 py-2 text-sm" placeholder="name@example.com" />
          <select name="role" className="rounded-md border px-3 py-2 text-sm">
            <option value="viewer">viewer</option>
            <option value="staff">staff</option>
            <option value="admin">admin</option>
            <option value="owner">owner</option>
          </select>
          <button className="rounded-md border px-3 py-2 text-sm hover:bg-muted md:col-span-1">Create invite</button>
          <p className="text-xs text-muted-foreground md:col-span-3">
            After creating, copy the invite link below and send it (Opal automation later).
          </p>
        </form>

        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Invite link</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(invites ?? []).map((i) => (
                <tr key={i.id} className="border-t">
                  <td className="p-3">{i.email}</td>
                  <td className="p-3">{i.role}</td>
                  <td className="p-3">{i.status}</td>
                  <td className="p-3 font-mono text-xs">/invite/{i.token}</td>
                  <td className="p-3">
                    <form action={revokeInvite}>
                      <input type="hidden" name="tenant_id" value={tenantId} />
                      <input type="hidden" name="invite_id" value={i.id} />
                      <button className="underline text-xs">Revoke</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold">Members</h3>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="p-3 text-left">User ID</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {(members ?? []).map((m) => (
                <tr key={m.user_id} className="border-t">
                  <td className="p-3 font-mono text-xs">{m.user_id}</td>
                  <td className="p-3">{m.role}</td>
                  <td className="p-3">{m.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
