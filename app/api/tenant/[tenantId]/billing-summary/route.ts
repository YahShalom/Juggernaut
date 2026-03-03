import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(
  request: Request,
  { params }: { params: { tenantId: string } }
) {
  const supabase = await createServerClient();
  const { tenantId: tenantRef } = params;

  if (!tenantRef) {
    return new NextResponse(JSON.stringify({ error: "Tenant ID is required" }), {
      status: 400,
    });
  }

  // Accept either tenant UUID or slug from client routes.
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    tenantRef
  );
  const { data: tenant, error: tenantError } = await supabase
    .from("tenants")
    .select("id")
    .eq(isUuid ? "id" : "slug", tenantRef)
    .single();

  if (tenantError || !tenant) {
    return new NextResponse(JSON.stringify({ error: "Tenant not found or access denied" }), {
      status: 404,
    });
  }
  
  // Now, fetch the billing summary from the view.
  // RLS on v_tenant_billing_summary will ensure the user can only see their own tenant's summary.
  const { data: summary, error: summaryError } = await supabase
    .from("v_tenant_billing_summary")
    .select("plan_name, total_requests, max_requests")
    .eq("tenant_id", tenant.id)
    .single();

  if (summaryError) {
    console.error("Error fetching billing summary:", summaryError);
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch billing summary" }),
      { status: 500 }
    );
  }

  if (!summary) {
    return new NextResponse(
      JSON.stringify({
        plan_name: "Unknown",
        total_requests: 0,
        max_requests: 0,
      }),
      { status: 200 }
    );
  }
  
  return NextResponse.json(summary);
}
