import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const body = await req.json();

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // TODO: derive tenant_id + user_id from your auth/session logic
  const tenant_id = body.tenant_id;
  const created_by = body.user_id ?? null;

  const { data, error } = await supabase
    .from("ai_job")
    .insert({
      tenant_id,
      created_by,
      job_type: body.job_type,
      input: body.input ?? {},
      idempotency_key: body.idempotency_key ?? null,
      status: "queued",
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ job_id: data.id }, { status: 200 });
}