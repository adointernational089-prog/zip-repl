import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://rgakfxsrwpxuqkfqprjl.supabase.co";

const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY must be set");
}

export function getSupabase() {
  return createClient(SUPABASE_URL, supabaseServiceKey!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
