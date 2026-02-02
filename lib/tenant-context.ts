
import 'server-only';
import { cache } from 'react';
import { lookupTenantBySlug } from './tenantLookup';

// This object holds the result of the tenant lookup.
const tenantContext = {
  tenant: null as Awaited<ReturnType<typeof lookupTenantBySlug>>['tenant'] | null,
  errorMessage: null as string | null,
};

/**
 * Resolves the tenant for the current request using the provided slug.
 * It uses React's `cache` to ensure the lookup only happens once per request.
 * The result (or error) is stored in a simple object for later retrieval.
 */
export const resolveTenantContext = cache(async (slug: string) => {
  console.log(`Caching tenant context for slug: ${slug}`);
  const { tenant, errorMessage } = await lookupTenantBySlug(slug);
  tenantContext.tenant = tenant;
  tenantContext.errorMessage = errorMessage;
  return tenantContext;
});

/**
 * Retrieves the previously resolved tenant context.
 * Throws an error if the context has not been resolved yet for this request,
 * preventing any untennanted operations.
 */
export function getTenantContext() {
  if (!tenantContext.tenant && !tenantContext.errorMessage) {
    throw new Error(
      'Tenant context has not been resolved for this request. Call resolveTenantContext() in a layout or middleware first.'
    );
  }
  return tenantContext;
}
