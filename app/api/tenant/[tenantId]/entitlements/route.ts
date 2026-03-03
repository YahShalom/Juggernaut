import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: Request,
  { params }: { params: { tenantId: string } }
) {
  const supabase = await createClient();
  const { tenantId: tenantRef } = params;

  if (!tenantRef) {
    return new NextResponse(JSON.stringify({ error: "Tenant ID is required" }), {
      status: 400,
    });
  }

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
  
  const { data, error } = await supabase
    .from("v_tenant_entitlements")
    .select("*")
    .eq("tenant_id", tenant.id)
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
