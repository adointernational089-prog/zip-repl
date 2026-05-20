import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://rgakfxsrwpxuqkfqprjl.supabase.co";

export function getSupabase() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY environment variable is not set");
  }
  return createClient(SUPABASE_URL, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
