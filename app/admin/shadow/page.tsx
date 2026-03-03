
import { createServerClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { createShadowTenant, seedShadowData } from './actions'
import { validateRequest } from '@/lib/auth/validateRequest'

async function getTenantCredits() {
  const supabase = await createServerClient()
  const { data, error } = await supabase.from('v_tenant_credits_dashboard').select('*')
  if (error) {
    console.error('Error fetching tenant credits:', error)
    return []
  }
  return data
}

export default async function ShadowAdminPage() {
  const { user } = await validateRequest()
  if (!user || user.role !== 'platform_tech') {
    notFound()
  }

  const credits = await getTenantCredits()

  return (
    <div className="app-shell">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-[var(--foreground)]">Shadow Tenants</h1>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Internal-only admin page for managing shadow tenants.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none space-x-2">
          <form action={createShadowTenant} className="inline-block">
            <button
              type="submit"
              className="btn-primary-gradient block rounded-md px-3 py-2 text-center text-sm font-semibold shadow-md"
            >
              Create Shadow Tenant
            </button>
          </form>
          <form action={seedShadowData} className="inline-block">
            <button
              type="submit"
              className="block rounded-md border border-[var(--border)] bg-[var(--secondary)] px-3 py-2 text-center text-sm font-semibold text-[var(--foreground)] hover:opacity-90"
            >
              Seed Data
            </button>
          </form>
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
                      Tenant ID
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-[var(--foreground)]">
                      Plan
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-[var(--foreground)]">
                      Credit Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {credits.map((tenant) => (
                    <tr key={tenant.tenant_id} className="table-row">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-[var(--foreground)] sm:pl-6">
                        {tenant.tenant_id}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-[var(--muted-foreground)]">{tenant.plan}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-[var(--muted-foreground)]">{tenant.credit_status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
