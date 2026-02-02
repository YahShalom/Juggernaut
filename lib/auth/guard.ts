import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { resolveTenantBySlug } from "@/lib/esa/tenant";
import { validateActiveMembership } from "@/lib/auth/membership";

type GuardArgs = {
  tenantSlug: string;
  roles?: string[];
};

export async function requireTenantUserRole({ tenantSlug, roles }: GuardArgs) {
  const supabase = await createSupabaseServerClient();

  // 1. Resolve tenant
  const { tenant, error: tenantError } = await resolveTenantBySlug(tenantSlug);
  if (tenantError || !tenant) redirect("/not-found");

  // 2. Require auth
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 3. Require membership
  const membership = await validateActiveMembership(tenant.id, user.id);

  if (!membership.isValid) {
    redirect("/unauthorized");
  }

  // 4. Optional role enforcement
  if (roles && !roles.includes(membership.role)) {
    redirect("/unauthorized");
  }

  return {
    tenant,
    tenantId: tenant.id,
    user,
    role: membership.role,
  };
}
