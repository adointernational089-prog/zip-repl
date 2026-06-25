import { Router } from "express";
import bcrypt from "bcryptjs";
import { getPool } from "../lib/db.js";

const router = Router();

router.post("/setup-admin", async (req, res) => {
  const secret = req.headers["x-setup-secret"];
  if (secret !== "bishal-setup-2026") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  try {
    const ADMIN_EMAIL = "bishalbishwokarma089@gmail.com";
    const ADMIN_PASSWORD = "bishal@ado@9802485583";
    const pool = getPool();
    const { rows } = await pool.query(
      "SELECT id, role FROM users WHERE email = $1 LIMIT 1", [ADMIN_EMAIL]
    );
    if (rows.length === 0) {
      const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
      await pool.query(
        "INSERT INTO users (email, name, password_hash, role) VALUES ($1, $2, $3, $4)",
        [ADMIN_EMAIL, "Bishal Bishwokarma", passwordHash, "admin"]
      );
      res.json({ success: true, message: "Admin user created" });
    } else {
      if (rows[0].role !== "admin") {
        await pool.query("UPDATE users SET role = 'admin' WHERE email = $1", [ADMIN_EMAIL]);
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
  const sql = `
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
);`.trim();
  res.json({ message: "Run the following SQL in your database to create the required tables.", sql });
});

export default router;
