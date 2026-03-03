import { cookies } from "next/headers";
import {
  createServerClient as createSupabaseSsrServerClient,
  type CookieOptions,
} from "@supabase/ssr";

function buildClient(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  return createSupabaseSsrServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {}
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options, maxAge: 0 });
          } catch {}
        },
      },
    }
  );
}

export async function createClient() {
  const cookieStore = await cookies();
  return buildClient(cookieStore);
}

// Backward-compatible alias used by existing server actions/routes.
export async function createSupabaseServerClient() {
  return createClient();
}

// Backward-compatible signature; optional cookieStore argument is ignored.
export async function createServerClient(_cookieStore?: unknown) {
  void _cookieStore;
  return createClient();
}
