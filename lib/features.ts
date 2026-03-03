
import { createTenantedSupabaseServerClient } from './supabase/tenanted-server';

/**
 * Checks if a specific feature is enabled for the currently resolved tenant.
 * It now uses the tenanted Supabase client, which ensures this check
 * cannot be performed without a valid, request-scoped tenant context.
 *
 * @param featureKey The key of the feature to check (e.g., 'atelier_salon_tryon_lite').
 * @returns A promise that resolves to true if the feature is enabled, otherwise false.
 */
export async function isFeatureEnabled(featureKey: string): Promise<boolean> {
  try {
    // Get the tenant-scoped client. This will throw if context is missing.
    const { supabase, tenantId } = await createTenantedSupabaseServerClient();
    
    const { error, count } = await supabase
      .from('tenant_features')
      .select('id', { count: 'exact' })
      .eq('tenant_id', tenantId) // Query is now explicitly scoped
      .eq('feature_key', featureKey)
      .eq('is_enabled', true)
      .single();

    if (error && error.code !== 'PGRST116') { // Ignore 'no rows found' error
      console.error(`Error checking feature flag "${featureKey}" for tenant ${tenantId}:`, error);
      return false;
    }
    
    return count === 1;
  } catch (error) {
    // Catches errors from getTenantContext() or the client creation itself
    console.error('Failed to check feature flag due to client/context error:', error);
    return false;
  }
}
