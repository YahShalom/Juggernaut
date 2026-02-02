import { gateModule } from "@/lib/esa/moduleGate.server";

export function withModuleGate<T>(
  handler: (ctx: { tenantId: string }) => Promise<T>,
  opts: { moduleKey: string; qty?: number; action?: string }
) {
  return async (req: Request) => {
    // ✅ YOU MUST implement this based on your app’s tenant resolution:
    // - from subdomain
    // - from path /t/[slug]
    // - from header x-tenant-id
    // - from jwt claim
    const tenantId = await resolveTenantIdFromRequest(req);

    await gateModule({
      tenantId,
      moduleKey: opts.moduleKey,
      qty: opts.qty ?? 1,
      action: opts.action ?? "call",
    });

    return handler({ tenantId });
  };
}

// ---------- IMPLEMENT THIS ONCE ----------
async function resolveTenantIdFromRequest(req: Request): Promise<string> {
  // Option A: Header set by middleware/server (recommended)
  const headerTenant = req.headers.get("x-tenant-id");
  if (headerTenant) return headerTenant;

  throw new Error("Missing tenant id (x-tenant-id). Implement tenant resolution.");
}