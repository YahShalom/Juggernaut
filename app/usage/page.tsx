import { createServerClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

type UsageRow = {
  plan: string;
  credit_status: string;
  module_usage: Record<string, string | number | boolean | null>;
};

async function getTenantUsage(tenantId: string) {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("v_tenant_credits_dashboard")
    .select("*")
    .eq("tenant_id", tenantId)
    .maybeSingle();
  if (error) {
    const msg =
      typeof error === "object" && error && "message" in error
        ? String((error as { message?: string }).message ?? "Unknown error")
        : "Unknown error";
    console.error("Error fetching tenant usage:", msg);
    return null;
  }

  const fallback: UsageRow = {
    plan: "Unknown",
    credit_status: "No data yet",
    module_usage: {},
  };

  if (!data) return fallback;

  return {
    plan: data.plan ?? fallback.plan,
    credit_status: data.credit_status ?? fallback.credit_status,
    module_usage:
      data.module_usage && typeof data.module_usage === "object"
        ? (data.module_usage as UsageRow["module_usage"])
        : fallback.module_usage,
  } satisfies UsageRow;
}

async function getActiveTenantIdForUser(userId: string) {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("tenant_members")
    .select("tenant_id")
    .eq("user_id", userId)
    .eq("status", "active")
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Error resolving tenant membership:", error);
    return null;
  }

  return data?.tenant_id ?? null;
}

export default async function UsagePage() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const tenantId = await getActiveTenantIdForUser(user.id);
  if (!tenantId) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
          <h1 className="text-xl font-semibold text-[var(--foreground)]">
            No active workspace membership
          </h1>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Your account is signed in, but no active tenant membership was found.
          </p>
          <Link className="mt-4 inline-block text-sm font-medium text-[var(--accent)]" href="/login">
            Return to login
          </Link>
        </div>
      </div>
    );
  }

  const usage = await getTenantUsage(tenantId);

  if (!usage) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
          <h1 className="text-xl font-semibold text-[var(--foreground)]">
            Usage data unavailable
          </h1>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            We could not load usage metrics right now. Please try again shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-[var(--foreground)]">
            Usage Dashboard
          </h1>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Your tenant's credit and module usage.
          </p>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="table-shell">
              <table className="min-w-full">
                <thead className="table-head">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-[var(--foreground)] sm:pl-6">
                      Metric
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-[var(--foreground)]">
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="table-row">
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-[var(--foreground)] sm:pl-6">
                      Plan
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-[var(--muted-foreground)]">{usage.plan}</td>
                  </tr>
                  <tr className="table-row">
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-[var(--foreground)] sm:pl-6">
                      Credit Status
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-[var(--muted-foreground)]">{usage.credit_status}</td>
                  </tr>
                  {
                    Object.entries(usage.module_usage).map(([key, value]) => (
                      <tr key={key} className="table-row">
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-[var(--foreground)] sm:pl-6">
                          {key}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-[var(--muted-foreground)]">{value as any}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
