// lib/supabase/admin.ts
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Service-role client — bypasses RLS entirely. NEVER import this file
// from a client component or anything that ships to the browser.
// SUPABASE_SERVICE_ROLE_KEY must NOT have the NEXT_PUBLIC_ prefix
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}