import { requireTech } from '@/lib/auth/roles';
import { createTenant } from '@/app/esa/tenants/actions';

export default async function NewTenantPage() {
  await requireTech();

  return (
    <div className="max-w-xl space-y-6">
      <h2 className="text-xl font-semibold">Create tenant</h2>
      <form action={createTenant} className="space-y-4 rounded-lg border p-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Tenant name</label>
          <input name="name" required className="w-full rounded-md border px-3 py-2 text-sm" placeholder="Perry D Beauty Studio" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Slug</label>
          <input name="slug" className="w-full rounded-md border px-3 py-2 text-sm font-mono" placeholder="perrydbeauty" />
          <p className="text-xs text-muted-foreground">Used in the URL: /[tenantSlug]/...</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Plan</label>
          <select name="plan" className="w-full rounded-md border px-3 py-2 text-sm">
            <option value="free">free</option>
            <option value="pro">pro</option>
            <option value="premium">premium</option>
          </select>
        </div>

        <button className="rounded-md border px-3 py-2 text-sm hover:bg-muted">Create</button>
      </form>
    </div>
  );
}
