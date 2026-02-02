'use server';

import { db } from '@/lib/db';
import { invites, tenants, usersToTenants } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function verifyInvite(token: string) {
    const invite = await db.query.invites.findFirst({
        where: eq(invites.token, token),
    });

    if (!invite || new Date() > invite.expiresAt) {
        return { success: false, tenantName: null, tenantSlug: null };
    }

    await db.insert(usersToTenants).values({
        userId: invite.userId,
        tenantId: invite.tenantId,
        role: invite.role,
    });

    await db.delete(invites).where(eq(invites.token, token));

    const tenant = await db.query.tenants.findFirst({
        where: eq(tenants.id, invite.tenantId),
    });

    return {
        success: true,
        tenantName: tenant?.name || null,
        tenantSlug: tenant?.slug || null,
    };
}
