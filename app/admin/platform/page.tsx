
import { createServerClient } from '@/lib/supabase/server';
import { validateRequest } from '@/lib/auth/validateRequest';
import { notFound } from 'next/navigation';

async function getPlatformKpis() {
  const supabase = await createServerClient();
  // Supabase from() returns a PostgrestResponse object, not a single object.
  const { data, error } = await supabase.from('v_platform_kpis').select('*').single();
  if (error) {
    console.error('Error fetching platform kpis:', error);
    return null;
  }
  return data;
}

async function getTenantHealth() {
  const supabase = await createServerClient();
  const { data, error } = await supabase.from('v_tenant_health').select('*');
  if (error) {
    console.error('Error fetching tenant health:', error);
    return [];
  }
  return data;
}

export default async function PlatformAdminPage() {
  const { user } = await validateRequest();
  if (!user || user.role !== 'platform_tech') {
    notFound();
  }

  const kpis = await getPlatformKpis();
  const tenantHealth = await getTenantHealth();

  const atRiskTenants = tenantHealth.filter(t => t.is_at_risk);

  // The top_modules column is a JSONB in the database, so it should be parsed.
  const topModules = kpis && typeof kpis.top_modules === 'string'
    ? JSON.parse(kpis.top_modules)
    : kpis?.top_modules || [];


  return (
    <div className="app-shell">
      <h1 className="mb-6 text-2xl font-bold text-[var(--foreground)]">Platform Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Active Tenants */}
        <div className="kpi-card">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Active Tenants</h2>
          <p className="mt-2 text-3xl font-bold text-[var(--accent)]">{kpis?.active_tenants ?? 'N/A'}</p>
        </div>

        {/* Credit Burn Rate */}
        <div className="kpi-card">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Credit Burn Rate (7d)</h2>
          <p className="mt-2 text-3xl font-bold text-[var(--primary)]">{kpis?.credit_burn_rate_7d ?? 'N/A'}</p>
        </div>

        {/* At-risk tenants */}
        <div className="kpi-card md:col-span-2">
            <h2 className="mb-4 text-lg font-semibold text-[var(--foreground)]">At-Risk Tenants</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="table-head">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                                Tenant ID
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                                Health Score
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {atRiskTenants.map(tenant => (
                            <tr key={tenant.tenant_id} className="table-row">
                                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-[var(--foreground)]">{tenant.tenant_id}</td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-red-500 dark:text-red-300">{tenant.health_score}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Top Modules */}
        <div className="kpi-card md:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-[var(--foreground)]">Top Modules</h2>
          <ul className="space-y-2">
            {Array.isArray(topModules) && topModules.map((module: any, index: number) => (
              <li key={index} className="flex items-center justify-between rounded-md border border-[var(--border)] bg-[var(--secondary)] px-4 py-2">
                <span className="text-sm font-medium text-[var(--foreground)]">{module.module_name}</span>
                <span className="text-sm text-[var(--muted-foreground)]">{module.request_count} requests</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
