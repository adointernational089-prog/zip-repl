import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function bootstrap() {
  console.log("Testing Supabase connection...");

  // Try to hit users table
  const { error: testError } = await supabase
    .from("users")
    .select("id")
    .limit(1);

  if (testError?.code === "PGRST205" || testError?.code === "42P01") {
    console.log("Tables missing. Please create them via Supabase SQL Editor.");
    console.log("URL: https://app.supabase.com/project/rgakfxsrwpxuqkfqprjl/sql/new");
    console.log("\nSQL to run:");
    console.log(`
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS apps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  url TEXT,
  icon_url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  sender_role TEXT NOT NULL CHECK (sender_role IN ('admin', 'user')),
  sender_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE apps DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE replies DISABLE ROW LEVEL SECURITY;
    `);
    return;
  }

  if (testError) {
    console.error("Connection error:", testError.message);
    return;
  }

  console.log("Tables exist! Creating admin user...");

  const ADMIN_EMAIL = "bishalbishwokarma089@gmail.com";
  const ADMIN_PASSWORD = "bishal@ado@9802485583";

  const { data: existing } = await supabase
    .from("users")
    .select("id, role")
    .eq("email", ADMIN_EMAIL)
    .limit(1);

  if (!existing || existing.length === 0) {
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    const { error } = await supabase.from("users").insert({
      email: ADMIN_EMAIL,
      name: "Bishal Bishwokarma",
      password_hash: passwordHash,
      role: "admin",
    });
    if (error) console.error("Failed to create admin:", error.message);
    else console.log("Admin created:", ADMIN_EMAIL);
  } else {
    if (existing[0].role !== "admin") {
      await supabase.from("users").update({ role: "admin" }).eq("email", ADMIN_EMAIL);
    }
    console.log("Admin already exists:", ADMIN_EMAIL);
  }

  console.log("Bootstrap complete!");
}

bootstrap();
