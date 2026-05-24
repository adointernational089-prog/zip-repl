import { createClient } from "@supabase/supabase-js";
import { Pool } from "pg";

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

let _pool: Pool | null = null;

export function getPool(): Pool {
  if (!_pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL environment variable is not set");
    }
    _pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });
  }
  return _pool;
}
