// SERVER ONLY — never import into client components

import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // server only
);

export type ModuleGateInput = {
  tenantId: string;
  moduleKey: string;
  qty?: number;     // default 1
  action?: string;  // default "call"
};

export async function gateModule({
  tenantId,
  moduleKey,
  qty = 1,
  action = "call",
}: ModuleGateInput) {
  // 1) Hard gate (throws if not allowed)
  const { error: gateErr } = await supabaseAdmin.rpc("assert_module_allowed", {
    p_tenant_id: tenantId,
    p_module_key: moduleKey,
    p_requested: qty,
  });

  if (gateErr) throw new Error(gateErr.message);

  // 2) Log usage (should not block main flow)
  const { error: logErr } = await supabaseAdmin.rpc("log_module_usage", {
    p_tenant_id: tenantId,
    p_module_key: moduleKey,
    p_action: action,
    p_quantity: qty,
  });

  // optional: swallow logging failures
  if (logErr) console.warn("log_module_usage failed:", logErr.message);
}