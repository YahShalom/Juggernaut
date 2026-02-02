import "server-only";
import { createClient } from "@supabase/supabase-js";

// Belt + suspenders: if this ever ends up in a browser bundle, fail loudly.
if (typeof window !== "undefined") {
  throw new Error("supabaseAdmin must never be imported in the browser");
}

// Ensure the necessary environment variables are set
// Prefer SUPABASE_URL, but fall back to NEXT_PUBLIC_SUPABASE_URL for convenience.
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
if (!SUPABASE_URL) {
  throw new Error('Missing env var: SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL)');
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing env var: SUPABASE_SERVICE_ROLE_KEY');
}

/**
 * A server-side only Supabase client that uses the SERVICE_ROLE_KEY.
 * This client can bypass Row Level Security and should be used with extreme care.
 * DO NOT EXPOSE THIS CLIENT TO THE BROWSER.
 */
export const supabaseAdmin = createClient(
  SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
