// @/app/components/demo-banner.tsx

export function DemoBanner({ tenantSlug }: { tenantSlug: string }) {
  const isDemoMode = process.env.DEMO_MODE === 'true';
  const isDemoTenant = tenantSlug === 'perrydbeauty';

  if (!isDemoMode || !isDemoTenant) {
    return null;
  }

  return (
    <div className="bg-yellow-400 text-yellow-900 text-center p-2 text-sm font-semibold">
      Demo Mode
    </div>
  );
}
