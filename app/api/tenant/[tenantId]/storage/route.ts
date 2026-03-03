import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { apiGuard } from "@/lib/auth/apiGuard";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request, { params }: { params: { tenantId: string } }) {
  const guard = await apiGuard(req, { tenantIdFrom: "params", params });
  if (!guard.ok) return guard.response;

  const { tenantId } = guard;
  const { qty = 1 } = await req.json();

  try {
    const { error } = await supabaseAdmin.rpc('enforce_usage', {
      p_tenant_id: tenantId,
      p_module_key: 'storage_mb',
      p_amount: qty
    });

    if (error) {
      throw error;
    }
  } catch (error) {
    return NextResponse.json({ error: "PLAN_LIMIT_REACHED" }, { status: 402 });
  }

  // Do the work... 

  const { error: e2 } = await supabaseAdmin
    .rpc("record_usage", {
      p_tenant_id: tenantId,
      p_module_key: "storage_mb",
      p_qty: qty,
      p_meta: { route: "storage", ok: true }
    });

  if (e2) return NextResponse.json({ error: e2.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
