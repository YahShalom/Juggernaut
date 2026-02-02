import { withModuleGate } from "@/lib/esa/withModuleGate.server";

export const POST = withModuleGate(
  async ({ tenantId }) => {
    // your module logic
    return Response.json({ ok: true, tenantId });
  },
  { moduleKey: "ai_crm", qty: 1, action: "call" }
);