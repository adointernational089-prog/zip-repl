import { Router } from "express";
import bcrypt from "bcryptjs";
import { getSupabase } from "../lib/db.js";

const router = Router();

const SETUP_TABLES_SQL = `
-- Run this once in your Supabase SQL Editor:

CREATE TABLE IF NOT EXISTS reactions (
  target_type TEXT NOT NULL,
  target_id   TEXT NOT NULL,
  emoji       TEXT NOT NULL,
  count       INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (target_type, target_id, emoji)
);

CREATE TABLE IF NOT EXISTS broadcasts (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title      TEXT NOT NULL,
  content    TEXT NOT NULL,
  type       TEXT NOT NULL DEFAULT 'info',
  created_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL
);
`.trim();

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
      if ((existing as any).role !== "admin") {
        await sb.from("users").update({ role: "admin" }).eq("email", ADMIN_EMAIL);
      }
      res.json({ success: true, message: "Admin already exists" });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/setup-tables", async (req, res) => {
  const secret = req.headers["x-setup-secret"];
  if (secret !== "bishal-setup-2026") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  res.json({
    message: "Run the following SQL in your Supabase SQL Editor to create the required tables.",
    sql: SETUP_TABLES_SQL,
  });
});

export default router;
