import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function GET(
  request: Request,
  { params }: { params: { tenantId: string } }
) {
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);
  const { tenantId } = params;

  if (!tenantId) {
    return new NextResponse(JSON.stringify({ error: "Tenant ID is required" }), {
      status: 400,
    });
  }

  // First, validate that the user has access to this tenant.
  // RLS should handle this, but an explicit check is good practice.
  const { data: tenant, error: tenantError } = await supabase
    .from("tenants")
    .select("id")
    .eq("id", tenantId)
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
    .eq("tenant_id", tenantId)
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
