
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/browser";

export default function TokenDisplay() {
  const [token, setToken] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchToken = async () => {
      const { data } = await supabase.auth.getSession();
      const token = data?.session?.access_token;
      setToken(token ?? null);
    };

    fetchToken();
  }, [supabase]);

  return (
    <div className="p-4 border rounded-md">
      <h2 className="text-lg font-semibold">Supabase Access Token</h2>
      {token ? (
        <p className="mt-2 text-sm text-gray-500 break-all">{token}</p>
      ) : (
        <p className="mt-2 text-sm text-gray-500">No token available.</p>
      )}
    </div>
  );
}
