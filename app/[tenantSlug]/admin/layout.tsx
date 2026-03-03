import { PlanLimitProvider } from '@/app/components/billing/PlanLimitContext';
import { ReactNode } from 'react';
import { BillingBanner } from '@/app/components/billing/BillingBanner';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <PlanLimitProvider>
      <div className="app-shell">
        <BillingBanner />
        {children}
      </div>
    </PlanLimitProvider>
  );
}
