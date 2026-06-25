import { Router } from "express";
import bcrypt from "bcryptjs";
import { getPool } from "../lib/db.js";
import { signToken } from "../lib/auth.js";
import { requireAuth, type AuthRequest } from "../middlewares/requireAuth.js";

const router = Router();
const ADMIN_EMAIL = "bishalbishwokarma089@gmail.com";

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "Email and password required" });
    return;
  }
  try {
    const pool = getPool();
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1 LIMIT 1", [email]);
    const user = rows[0];
    if (!user) { res.status(401).json({ error: "Invalid credentials" }); return; }
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) { res.status(401).json({ error: "Invalid credentials" }); return; }
    const token = signToken({ userId: user.id, email: user.email, role: user.role });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role, created_at: user.created_at } });
  } catch (err) {
    req.log?.error({ err }, "Login error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/register", async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    res.status(400).json({ error: "Email, password and name required" });
    return;
  }
  try {
    const pool = getPool();
    const { rows: existing } = await pool.query("SELECT id FROM users WHERE email = $1 LIMIT 1", [email]);
    if (existing.length > 0) { res.status(409).json({ error: "Email already exists" }); return; }
    const passwordHash = await bcrypt.hash(password, 10);
    const role = email === ADMIN_EMAIL ? "admin" : "user";
    const { rows } = await pool.query(
      "INSERT INTO users (email, name, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role, created_at",
      [email, name, passwordHash, role]
    );
    const user = rows[0];
    if (!user) { res.status(500).json({ error: "Internal server error" }); return; }
    const token = signToken({ userId: user.id, email: user.email, role: user.role });
    res.status(201).json({ token, user });
  } catch (err) {
    req.log?.error({ err }, "Register error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/change-password", requireAuth, async (req: AuthRequest, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    res.status(400).json({ error: "Current password and new password are required" });
    return;
  }
  if (newPassword.length < 6) {
    res.status(400).json({ error: "New password must be at least 6 characters" });
    return;
  }
  try {
    const pool = getPool();
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [req.user!.userId]);
    const user = rows[0];
    if (!user) { res.status(404).json({ error: "User not found" }); return; }
    const isValid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isValid) { res.status(401).json({ error: "Current password is incorrect" }); return; }
    const newHash = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE users SET password_hash = $1 WHERE id = $2", [newHash, req.user!.userId]);
    res.json({ success: true, message: "Password changed successfully" });
  } catch (err) {
    req.log?.error({ err }, "Change password error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/me", requireAuth, async (req: AuthRequest, res) => {
  try {
    const pool = getPool();
    const { rows } = await pool.query(
      "SELECT id, email, name, role, created_at FROM users WHERE id = $1",
      [req.user!.userId]
    );
    if (!rows[0]) { res.status(401).json({ error: "User not found" }); return; }
    res.json(rows[0]);
  } catch (err) {
    req.log?.error({ err }, "Get me error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
