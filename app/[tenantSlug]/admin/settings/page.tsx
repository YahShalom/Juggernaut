import { createTenantedSupabaseServerClient } from '@/lib/supabase/tenanted-server';
import { getSkin } from '@/lib/skin/getSkin';
import { saveBrand } from './actions';
import SettingsForm from './SettingsForm';

export default async function SettingsPage({ params }: { params: { tenantSlug: string } }) {
  const { supabase, tenant } = createTenantedSupabaseServerClient();

  if (!tenant) {
    return <div>Tenant not found</div>;
  }

  const skin = getSkin(tenant);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Manage Brand</h1>
      <SettingsForm skin={skin} onSave={saveBrand} tenantSlug={params.tenantSlug} />
    </div>
  );
}
