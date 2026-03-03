import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { apiGuard } from "@/lib/auth/apiGuard";

export async function POST(req: Request) {
  const guard = await apiGuard(req, { tenantIdFrom: "body" });
  if (!guard.ok) return guard.response;

  const { body, tenantId } = guard;
  const feature = body?.feature;
  const amount = body?.amount;

  if (typeof feature !== "string" || !feature.trim()) {
    return NextResponse.json(
      { error: "Invalid payload: feature must be a non-empty string." },
      { status: 400 }
    );
  }

  if (typeof amount !== "number" || Number.isNaN(amount)) {
    return NextResponse.json(
      { error: "Invalid payload: amount must be a number." },
      { status: 400 }
    );
  }

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // server-only
  );

  const { data, error } = await admin.rpc("consume_feature", {
    p_tenant_id: tenantId,
    p_feature: feature,
    p_amount: amount,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, data });
}
