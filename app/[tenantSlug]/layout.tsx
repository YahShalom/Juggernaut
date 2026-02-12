import type { ReactNode } from "react";
import { DemoBanner } from "../components/demo-banner";

/**
 * Tenant layout: MUST NOT render <html> or <body>.
 * Only app/layout.tsx owns the document shell.
 */

type LayoutProps = {
  children: ReactNode;
  params: { tenantSlug: string };
};

export default function TenantLayout({ children, params }: LayoutProps) {
  const { tenantSlug } = params;

  return (
    <div className="min-h-screen">
      <DemoBanner tenantSlug={tenantSlug} />
      {children}
    </div>
  );
}
