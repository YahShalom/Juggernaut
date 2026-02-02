
import { redirect } from 'next/navigation';
import TryonClientPage from '@/components/atelier-salon/tryon-client-page';
import { isFeatureEnabled } from '@/lib/features';
import { resolveTenantContext } from '@/lib/tenant-context';
import { createTenantedSupabaseServerClient } from '@/lib/supabase/tenanted-server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

// Revalidate this page every 60 seconds to refetch hair styles
export const revalidate = 60;

export default async function TryonPage({ params }: { params: { tenantSlug: string } }) {
    // 1. Resolve tenant context once per request. This is now the source of truth.
    const { tenant, errorMessage } = await resolveTenantContext(params.tenantSlug);

    if (errorMessage || !tenant) {
        // Handle "not found" or "configuration error" from the lookup
        return <div className="p-4 text-center">{errorMessage || 'Tenant could not be loaded.'}</div>;
    }

    // 2. Check if the feature is enabled for this tenant using the new context-aware function.
    const featureEnabled = await isFeatureEnabled('atelier_salon_tryon_lite');
    if (!featureEnabled) {
        return <div className="p-4 text-center">This feature is not available for {tenant.name}.</div>;
    }

    // 3. Check for active user session (can use a non-tenanted client for this)
    const supabase = await createSupabaseServerClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        const redirectTo = `/${tenant.slug}/auth/signin?callbackUrl=/${tenant.slug}/atelier/salon/tryon`;
        redirect(redirectTo);
    }

    // 4. Fetch data using the MANDATORY tenanted client.
    // This will fail hard if the tenant context wasn't resolved, preventing untennanted queries.
    let hairStyles = [];
    try {
        const { supabase: tenantedSupabase, tenantId } = createTenantedSupabaseServerClient();
        const { data: stylesData, error: stylesError } = await tenantedSupabase
            .from('hair_styles')
            .select(`
                id, name, description, overlay_image_path, 
                default_scale, default_offset_x, default_offset_y, default_rotation, default_opacity, 
                category:hair_style_categories(name)
            `)
            .eq('tenant_id', tenantId) // Query remains explicitly scoped for clarity
            .eq('status', 'active')
            .order('name');

        if (stylesError) throw stylesError;
        hairStyles = stylesData || [];

    } catch (error) {
        console.error('Failed to fetch hair styles with tenanted client:', error);
        return <div>Error loading styles. Please try again later.</div>;
    }

    return (
        <TryonClientPage 
            tenant={tenant}
            initialHairStyles={hairStyles}
        />
    );
}
