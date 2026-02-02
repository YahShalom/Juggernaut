import { createTenantedSupabaseServerClient } from '@/lib/supabase/tenanted-server';
import { saveOffering, deleteOffering } from './actions';
import OfferingsClient from './OfferingsClient';

export default async function FashionOfferingsPage({ params }: { params: { tenantSlug: string } }) {
  const { supabase } = createTenantedSupabaseServerClient();

  const { data: offerings, error } = await supabase
    .from('offerings')
    .select('*, staff(*)')
    .eq('type', 'fashion');

  if (error) {
    console.error('Error fetching offerings:', error);
    // Handle error appropriately
    return <div>Error loading offerings.</div>;
  }

  return (
    <OfferingsClient 
      initialOfferings={offerings || []} 
      saveAction={saveOffering} 
      deleteAction={deleteOffering} 
      tenantSlug={params.tenantSlug} 
    />
  );
}
