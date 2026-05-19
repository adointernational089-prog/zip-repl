import { Router } from "express";
import bcrypt from "bcryptjs";
import { getSupabase } from "../lib/db.js";

const router = Router();

router.post("/migrate", async (req, res) => {
  const secret = req.headers["x-setup-secret"];
  if (secret !== "bishal-setup-2026") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  try {
    const sb = getSupabase();
    const statements = [
      `CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
        created_at TIMESTAMPTZ DEFAULT NOW()
      )`,
      `CREATE TABLE IF NOT EXISTS apps (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        url TEXT,
        icon_url TEXT NOT NULL,
        description TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )`,
      `CREATE TABLE IF NOT EXISTS messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE SET NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )`,
      `CREATE TABLE IF NOT EXISTS replies (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
        user_id UUID REFERENCES users(id) ON DELETE SET NULL,
        content TEXT NOT NULL,
        sender_role TEXT NOT NULL CHECK (sender_role IN ('admin', 'user')),
        sender_name TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )`,
      `CREATE TABLE IF NOT EXISTS projects (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        description TEXT,
        images TEXT DEFAULT '[]',
        tech_stack TEXT,
        link_url TEXT,
        status TEXT DEFAULT 'in-progress',
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )`,
    ];
    const results: string[] = [];
    for (const sql of statements) {
      const { error } = await sb.rpc("exec_migration", { sql_text: sql }).select();
      if (error) {
        results.push(`SKIP (${error.message})`);
      } else {
        results.push("OK");
      }
    }
    res.json({ success: true, results });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/setup-admin", async (req, res) => {
  const secret = req.headers["x-setup-secret"];
  if (secret !== "bishal-setup-2026") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  try {
    const ADMIN_EMAIL = "bishalbishwokarma089@gmail.com";
    const ADMIN_PASSWORD = "bishal@ado@9802485583";
    const sb = getSupabase();
    const { data: existing } = await sb.from("users").select("id, role").eq("email", ADMIN_EMAIL).limit(1).single();
    if (!existing) {
      const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
      const { error } = await sb.from("users").insert({
        email: ADMIN_EMAIL,
        name: "Bishal Bishwokarma",
        password_hash: passwordHash,
        role: "admin",
      });
      if (error) throw error;
      res.json({ success: true, message: "Admin user created" });
    } else {
      if (existing.role !== "admin") {
        await sb.from("users").update({ role: "admin" }).eq("email", ADMIN_EMAIL);
      }
      res.json({ success: true, message: "Admin already exists" });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
