import { createTenantedSupabaseServerClient } from '@/lib/supabase/tenanted-server';
import { getSkin } from '@/lib/skin/getSkin';
import { saveBrand } from './actions';
import SettingsForm from './SettingsForm';

export default async function SettingsPage({ params }: { params: { tenantSlug: string } }) {
  const { supabase, tenant } = await createTenantedSupabaseServerClient();

  if (!tenant) {
    return <div>Tenant not found</div>;
  }

  const skin = getSkin(tenant);

  return (
    <div className="glass-panel p-8">
      <h1 className="mb-8 text-3xl font-bold text-[var(--foreground)]">Manage Brand</h1>
      <SettingsForm skin={skin} onSave={saveBrand} tenantSlug={params.tenantSlug} />
    </div>
  );
}
