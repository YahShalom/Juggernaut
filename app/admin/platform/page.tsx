
import { createServerClient } from '@/lib/supabase/server';
import { validateRequest } from '@/lib/auth/validateRequest';
import { notFound } from 'next/navigation';

async function getPlatformKpis() {
  const supabase = createServerClient();
  // Supabase from() returns a PostgrestResponse object, not a single object.
  const { data, error } = await supabase.from('v_platform_kpis').select('*').single();
  if (error) {
    console.error('Error fetching platform kpis:', error);
    return null;
  }
  return data;
}

async function getTenantHealth() {
  const supabase = createServerClient();
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
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-white mb-6">Platform Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Active Tenants */}
        <div className="bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-white">Active Tenants</h2>
          <p className="text-3xl font-bold text-green-400 mt-2">{kpis?.active_tenants ?? 'N/A'}</p>
        </div>

        {/* Credit Burn Rate */}
        <div className="bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-white">Credit Burn Rate (7d)</h2>
          <p className="text-3xl font-bold text-blue-400 mt-2">{kpis?.credit_burn_rate_7d ?? 'N/A'}</p>
        </div>

        {/* At-risk tenants */}
        <div className="bg-gray-800 rounded-lg shadow p-6 md:col-span-2">
            <h2 className="text-lg font-semibold text-white mb-4">At-Risk Tenants</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-900">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Tenant ID
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Health Score
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                        {atRiskTenants.map(tenant => (
                            <tr key={tenant.tenant_id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{tenant.tenant_id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-400">{tenant.health_score}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Top Modules */}
        <div className="bg-gray-800 rounded-lg shadow p-6 md:col-span-2">
          <h2 className="text-lg font-semibold text-white mb-4">Top Modules</h2>
          <ul className="space-y-2">
            {Array.isArray(topModules) && topModules.map((module: any, index: number) => (
              <li key={index} className="flex justify-between items-center bg-gray-900 px-4 py-2 rounded-md">
                <span className="text-sm font-medium text-white">{module.module_name}</span>
                <span className="text-sm text-gray-400">{module.request_count} requests</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
