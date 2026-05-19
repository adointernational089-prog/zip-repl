import { Router } from "express";
import bcrypt from "bcryptjs";
import { query } from "../lib/db.js";

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
    const existing = await query("SELECT id, role FROM users WHERE email=$1 LIMIT 1", [ADMIN_EMAIL]);
    if (existing.rows.length === 0) {
      const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
      await query(
        "INSERT INTO users (email, name, password_hash, role) VALUES ($1,$2,$3,$4)",
        [ADMIN_EMAIL, "Bishal Bishwokarma", passwordHash, "admin"]
      );
      res.json({ success: true, message: "Admin user created" });
    } else {
      if (existing.rows[0].role !== "admin") {
        await query("UPDATE users SET role='admin' WHERE email=$1", [ADMIN_EMAIL]);
      }
      res.json({ success: true, message: "Admin already exists" });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
