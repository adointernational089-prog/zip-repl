import { Router } from "express";
import bcrypt from "bcryptjs";
import { query } from "../lib/db.js";
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
    const result = await query("SELECT * FROM users WHERE email = $1 LIMIT 1", [email]);
    if (result.rows.length === 0) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
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
    const existing = await query("SELECT id FROM users WHERE email = $1 LIMIT 1", [email]);
    if (existing.rows.length > 0) {
      res.status(409).json({ error: "Email already exists" });
      return;
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const role = email === ADMIN_EMAIL ? "admin" : "user";
    const result = await query(
      "INSERT INTO users (email, name, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role, created_at",
      [email, name, passwordHash, role]
    );
    const user = result.rows[0];
    const token = signToken({ userId: user.id, email: user.email, role: user.role });
    res.status(201).json({ token, user });
  } catch (err) {
    req.log?.error({ err }, "Register error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/me", requireAuth, async (req: AuthRequest, res) => {
  try {
    const result = await query("SELECT id, email, name, role, created_at FROM users WHERE id = $1 LIMIT 1", [req.user!.userId]);
    if (result.rows.length === 0) {
      res.status(401).json({ error: "User not found" });
      return;
    }
    res.json(result.rows[0]);
  } catch (err) {
    req.log?.error({ err }, "Get me error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
