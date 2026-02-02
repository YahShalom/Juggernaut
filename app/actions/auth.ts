'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { validatePassword } from '@/app/lib/password-policy';

// A simple in-memory store for rate limiting.
// NOTE: This is for demonstration. In production, use a persistent store like Redis.
const requestStore: Record<string, { count: number; lastRequest: number }> = {};
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS = 5;

export async function signUpWithPassword(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const tenantSlug = formData.get('tenantSlug') as string;

    const ip = 'unknown'; // In a real app, you would get the IP from the request headers

    // Basic Rate Limiting
    const now = Date.now();
    const userRequests = requestStore[ip] || { count: 0, lastRequest: now };
    if (now - userRequests.lastRequest > RATE_LIMIT_WINDOW) {
        userRequests.count = 0;
        userRequests.lastRequest = now;
    }
    userRequests.count++;
    if (userRequests.count > MAX_REQUESTS) {
        return { error: 'Too many requests. Please try again in a minute.' };
    }

    // Server-side validation
    const { isValid, reasons } = validatePassword(password, 'adminesa', tenantSlug);
    if (!isValid) {
        return { error: `Invalid password: ${reasons.join(', ')}` };
    }

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
        return { error: error.message };
    }

    return { data };
}
