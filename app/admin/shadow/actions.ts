'use server'

import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createShadowTenant() {
  const supabase = await createServerClient()
  const { error } = await supabase.rpc('create_shadow_tenant')

  if (error) {
    console.error('Error creating shadow tenant:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/shadow')
  return { error: null }
}

export async function seedShadowData() {
  const supabase = await createServerClient()
  const { error } = await supabase.rpc('seed_shadow_data')

  if (error) {
    console.error('Error seeding shadow data:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/shadow')
  return { error: null }
}
