'use server'

import { lucia } from "@/lib/auth/lucia";
import { validateRequest } from "@/lib/auth/validateRequest";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from '@/lib/db';
import { users, tenants } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const signInSchema = z.object({
    workspace: z.string().min(3, 'Workspace must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
});

export const signInWithEmail = async (prevState: any, formData: FormData) => {
    const validatedFields = signInSchema.safeParse({
        workspace: formData.get('workspace'),
        email: formData.get('email'),
    });

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { workspace, email } = validatedFields.data;

    try {
        const tenant = await db.query.tenants.findFirst({
            where: eq(tenants.slug, workspace),
        });

        if (!tenant) {
            return {
                success: false,
                errors: { _general: ['Invalid workspace.'] },
            };
        }

        const user = await db.query.users.findFirst({
            where: eq(users.email, email),
        });

        if (!user) {
            // In a real app, you might want to send a magic link instead
            // For this demo, we'll treat it as a login failure
            return {
                success: false,
                errors: { _general: ['Incorrect email address.'] },
            };
        }

        const session = await lucia.createSession(user.id, {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

        return {
            success: true,
            errors: {},
        };
    } catch (error) {
        console.error('Error signing in:', error);
        return {
            success: false,
            errors: { _general: ['An unexpected error occurred.'] },
        };
    }
};


export const logout = async () => {
    const { session } = await validateRequest();
    if (!session) {
        throw new Error("No session found");
    }

    await lucia.invalidateSession(session.id);

    const sessionCookie = lucia.createBlankSessionCookie();
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    return redirect("/login");
};