import Link from 'next/link';
import { requireTech } from '@/lib/auth/roles';
import { supabaseAdmin } from '@/lib/supabase/admin';

export default async function EsaHome() {
  await requireTech();

  const { data: tenants } = await supabaseAdmin
    .from('tenants')
    .select('id, slug, name, status, plan, updated_at')
    .order('updated_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Tenants</h2>
        <Link
          href="/esa/tenants/new"
          className="rounded-md border px-3 py-2 text-sm hover:bg-muted"
        >
          + New tenant
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Slug</th>
              <th className="p-3 text-left">Plan</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(tenants ?? []).map((t) => (
              <tr key={t.id} className="border-t">
                <td className="p-3">{t.name}</td>
                <td className="p-3 font-mono">{t.slug}</td>
                <td className="p-3">{t.plan ?? 'free'}</td>
                <td className="p-3">{t.status ?? 'active'}</td>
                <td className="p-3">
                  <Link
                    href={`/esa/tenants/${t.id}`}
                    className="underline"
                  >
                    Manage
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground">
        Tip: open a tenant site at <span className="font-mono">/[tenantSlug]</span>
      </p>
    </div>
  );
}
