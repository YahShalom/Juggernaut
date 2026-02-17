import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: Request,
  { params }: { params: { tenantId: string } }
) {
  const supabase = await createClient();
  const { tenantId } = params;

  if (!tenantId) {
    return new NextResponse(JSON.stringify({ error: "Tenant ID is required" }), {
      status: 400,
    });
  }

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
  
  const { data, error } = await supabase
    .from("v_tenant_entitlements")
    .select("*")
    .eq("tenant_id", tenantId)
    .single();

  if (error) {
    console.error("Error fetching entitlements:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch entitlements" }),
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}
