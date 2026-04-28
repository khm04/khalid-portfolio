/**
 * Supabase client (browser).
 *
 * The anon key is safe to expose — Row Level Security in Postgres is what
 * actually protects data. Never put the `service_role` key here.
 */
import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error(
    "Missing Supabase env vars. Copy .env.example to .env.local and fill in values.",
  );
}

// Note: Database types live in `database.types.ts`. We don't pass them as a
// generic to createClient yet because the supabase-js v2 generic shape is
// finicky to maintain by hand. After Phase 2 lands, regenerate with:
//   npx supabase gen types typescript --project-id <ref> > src/lib/database.types.ts
// then add `<Database>` back here.
export const supabase = createClient(url, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

/** The email allowed to perform admin actions (matches RLS policies). */
export const ADMIN_EMAIL =
  import.meta.env.VITE_ADMIN_EMAIL ?? "khalidmasoud4321@gmail.com";
