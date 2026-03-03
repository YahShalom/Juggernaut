import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { apiGuard } from "@/lib/auth/apiGuard";

export async function POST(req: Request) {
  const guard = await apiGuard(req, { tenantIdFrom: "body" });
  if (!guard.ok) return guard.response;

  const { body, tenantId, user } = guard;
  const jobType = body.job_type;
  const input = body.input;
  const idempotencyKey = body.idempotency_key;

  if (typeof jobType !== "string" || !jobType.trim()) {
    return NextResponse.json(
      { error: "Invalid payload: job_type must be a non-empty string." },
      { status: 400 }
    );
  }

  if (input !== undefined && (typeof input !== "object" || input === null || Array.isArray(input))) {
    return NextResponse.json(
      { error: "Invalid payload: input must be an object when provided." },
      { status: 400 }
    );
  }

  if (idempotencyKey !== undefined && idempotencyKey !== null && typeof idempotencyKey !== "string") {
    return NextResponse.json(
      { error: "Invalid payload: idempotency_key must be a string when provided." },
      { status: 400 }
    );
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const created_by = user.id;

  const { data, error } = await supabase
    .from("ai_job")
    .insert({
      tenant_id: tenantId,
      created_by,
      job_type: jobType,
      input: (input as Record<string, unknown> | undefined) ?? {},
      idempotency_key: (idempotencyKey as string | null | undefined) ?? null,
      status: "queued",
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ job_id: data.id }, { status: 200 });
}
