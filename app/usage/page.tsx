import { createServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { validateRequest } from "@/lib/auth/validateRequest";

async function getTenantUsage(tenantId: string) {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("v_tenant_credits_dashboard")
    .select("*")
    .eq("tenant_id", tenantId)
    .single();
  if (error) {
    console.error("Error fetching tenant usage:", error);
    return null;
  }
  return data;
}

export default async function UsagePage() {
  const { user } = await validateRequest();
  if (!user || !user.tenant_id) {
    notFound();
  }

  const usage = await getTenantUsage(user.tenant_id);

  if (!usage) {
    notFound();
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-white">
            Usage Dashboard
          </h1>
          <p className="mt-2 text-sm text-gray-300">
            Your tenant's credit and module usage.
          </p>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-800">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6">
                      Metric
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800 bg-gray-900">
                  <tr>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-6">
                      Plan
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{usage.plan}</td>
                  </tr>
                  <tr>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-6">
                      Credit Status
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{usage.credit_status}</td>
                  </tr>
                  {
                    Object.entries(usage.module_usage).map(([key, value]) => (
                      <tr key={key}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-6">
                          {key}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{value as any}</td>
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
