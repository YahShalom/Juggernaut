
import 'server-only';
import { createSupabaseServerClient } from '@/lib/supabase/server';

type ValidationResult = 
  | { isValid: true; role: string }
  | { isValid: false; reason: string };

/**
 * Validates if a user has an active membership for a specific tenant.
 *
 * This is a crucial security check performed after authentication to ensure
 * the user is a legitimate and active member of the requested workspace.
 *
 * @param tenantId The UUID of the tenant to check against.
 * @param userId The UUID of the authenticated user.
 * @returns An object indicating if the membership is valid. If valid, it includes the user's role.
 *          If invalid, it includes a reason for the failure.
 */
export async function validateActiveMembership(tenantId: string, userId: string): Promise<ValidationResult> {
  console.log(`Validating membership for user ${userId} in tenant ${tenantId}`);
  const supabase = await createSupabaseServerClient();

  const { data: member, error } = await supabase
    .from('tenant_members')
    .select('role, status')
    .eq('tenant_id', tenantId)
    .eq('user_id', userId)
    .single();

  // Handle query errors or no membership found
  if (error) {
    if (error.code === 'PGRST116') { // "PGRST116" indicates that no rows were found
      console.warn(`Attempted access by non-member (user: ${userId}) in tenant: ${tenantId}`);
      return { isValid: false, reason: 'You are not a member of this workspace.' };
    }
    // For other unexpected database errors
    console.error(`Supabase error validating membership for user ${userId} in tenant ${tenantId}:`, error);
    return { isValid: false, reason: 'A database error occurred while verifying your membership.' };
  }

  // Check if the membership status is active
  if (member.status !== 'active') {
    console.warn(`Inactive member attempt (user: ${userId}, status: ${member.status}) in tenant: ${tenantId}`);
    return { isValid: false, reason: 'Your membership for this workspace is inactive. Please contact an administrator.' };
  }

  console.log(`Membership validated for user ${userId}. Role: ${member.role}`);
  return { isValid: true, role: member.role };
}
