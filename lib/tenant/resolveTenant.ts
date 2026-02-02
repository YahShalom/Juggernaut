import 'server-only'

import { supabaseAdmin } from '@/lib/supabase/admin'
import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'

export const resolveTenant = (tenantSlug: string) =>
  unstable_cache(
    async () => {
      const { data: tenant } = await supabaseAdmin
        .from('tenants')
        .select('id, slug, name, brand_json, plan, status')
        .eq('slug', tenantSlug)
        .single()

      if (!tenant) {
        return notFound()
      }

      return {
        id: tenant.id,
        tenant_id: tenant.id,
        slug: tenant.slug,
        name: tenant.name,
        brand_json: tenant.brand_json,
        plan: tenant.plan,
        status: tenant.status,
      }
    },
    [`tenant-${tenantSlug}`],
    {
      tags: [`tenant-${tenantSlug}`],
    }
  )()