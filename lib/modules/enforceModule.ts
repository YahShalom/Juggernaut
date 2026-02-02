// SERVER ONLY — never import into client components

import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // server only
);

export async function enforceModule({
  tenantId,
  moduleKey,
  qty = 1,
  action = "call",
}: {
  tenantId: string;
  moduleKey: string;
  qty?: number;
  action?: string;
}) {
  // 1) Hard gate
  const { error: gateErr } = await supabaseAdmin.rpc(
    "assert_module_allowed",
    {
      p_tenant_id: tenantId,
      p_module_key: moduleKey,
      p_requested: qty,
    }
  );

  if (gateErr) {
    throw new Error(gateErr.message);
  }

  // 2) Log usage (non-blocking)
  await supabaseAdmin.rpc("log_module_usage", {
    p_tenant_id: tenantId,
    p_module_key: moduleKey,
    p_action: action,
    p_quantity: qty,
  });
}