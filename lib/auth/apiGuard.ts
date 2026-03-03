import "server-only";

import { NextResponse } from "next/server";
import type { User } from "@supabase/supabase-js";
import { createServerClient } from "@/lib/supabase/server";

type TenantSource = "params" | "body";

type GuardOptions = {
  tenantIdFrom: TenantSource;
  params?: { tenantId?: string };
};

type GuardSuccess = {
  ok: true;
  user: User;
  tenantId: string;
  body?: Record<string, unknown>;
};

type GuardFailure = {
  ok: false;
  response: NextResponse;
};

type GuardResult = GuardSuccess | GuardFailure;

async function createServerSupabase() {
  return createServerClient();
}

export async function apiGuard(req: Request, options: GuardOptions): Promise<GuardResult> {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  let tenantId: string | null = null;
  let parsedBody: Record<string, unknown> | undefined;

  if (options.tenantIdFrom === "params") {
    tenantId = options.params?.tenantId ?? null;
  } else {
    try {
      const body = (await req.json()) as Record<string, unknown>;
      parsedBody = body;
      const fromBody = body.tenantId ?? body.tenant_id;
      tenantId = typeof fromBody === "string" ? fromBody : null;
    } catch {
      return {
        ok: false,
        response: NextResponse.json({ error: "Invalid JSON body" }, { status: 400 }),
      };
    }
  }

  if (!tenantId) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Tenant ID is required" }, { status: 400 }),
    };
  }

  const { data: membership, error: membershipError } = await supabase
    .from("tenant_members")
    .select("tenant_id")
    .eq("tenant_id", tenantId)
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle();

  if (membershipError || !membership) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return {
    ok: true,
    user,
    tenantId,
    body: parsedBody,
  };
}
