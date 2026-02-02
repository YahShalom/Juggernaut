
import 'server-only';
import { redirect } from 'next/navigation';
import { lookupTenantBySlug } from '@/lib/tenantLookup';

export async function resolveTenantBySlug(tenantSlug: string) {
  const { tenant, errorMessage } = await lookupTenantBySlug(tenantSlug);

  if (errorMessage) {
    // This is a simplified error handling. In a real app, you'd
    // want to show a proper "not found" page.
    redirect('/404');
  }

  return { tenant, tenantId: tenant!.id };
}
