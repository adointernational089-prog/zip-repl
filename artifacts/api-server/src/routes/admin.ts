import { Router } from "express";
import bcrypt from "bcryptjs";
import { getPool } from "../lib/db.js";
import { requireAdmin, type AuthRequest } from "../middlewares/requireAuth.js";

const router = Router();
const ADMIN_EMAIL = "bishalbishwokarma089@gmail.com";

router.get("/stats", requireAdmin, async (req: AuthRequest, res) => {
  try {
    const pool = getPool();
    const [msgs, users, apps, repliedRows, allMsgRows] = await Promise.all([
      pool.query("SELECT COUNT(*) FROM messages"),
      pool.query("SELECT COUNT(*) FROM users"),
      pool.query("SELECT COUNT(*) FROM apps"),
      pool.query("SELECT DISTINCT message_id FROM replies"),
      pool.query("SELECT id FROM messages"),
    ]);
    const repliedIds = new Set(repliedRows.rows.map((r: any) => r.message_id));
    const unread = allMsgRows.rows.filter((m: any) => !repliedIds.has(m.id)).length;
    res.json({
      total_messages: parseInt(msgs.rows[0].count, 10),
      total_users: parseInt(users.rows[0].count, 10),
      total_apps: parseInt(apps.rows[0].count, 10),
      unread_messages: unread,
    });
  } catch (err) {
    req.log?.error({ err }, "Admin stats error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/users", requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { rows } = await getPool().query(
      "SELECT id, email, name, role, created_at FROM users ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    req.log?.error({ err }, "List users error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/users", requireAdmin, async (req: AuthRequest, res) => {
  const { email, password, name, role } = req.body;
  if (!email || !password || !name) {
    res.status(400).json({ error: "Email, password and name are required" });
    return;
  }
  if (password.length < 6) {
    res.status(400).json({ error: "Password must be at least 6 characters" });
    return;
  }
  try {
    const pool = getPool();
    const { rows: existing } = await pool.query("SELECT id FROM users WHERE email = $1 LIMIT 1", [email]);
    if (existing.length > 0) { res.status(409).json({ error: "Email already exists" }); return; }
    const passwordHash = await bcrypt.hash(password, 10);
    const assignedRole = email === ADMIN_EMAIL ? "admin" : (role === "admin" ? "admin" : "user");
    const { rows } = await pool.query(
      "INSERT INTO users (email, name, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role, created_at",
      [email, name, passwordHash, assignedRole]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    req.log?.error({ err }, "Admin create user error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/users/:id", requireAdmin, async (req: AuthRequest, res) => {
  const { id } = req.params;
  if (id === req.user!.userId) {
    res.status(400).json({ error: "You cannot delete your own account" });
    return;
  }
  try {
    const pool = getPool();
    const { rows } = await pool.query("SELECT email FROM users WHERE id = $1", [id]);
    if (rows[0]?.email === ADMIN_EMAIL) {
      res.status(400).json({ error: "Cannot delete the primary admin account" });
      return;
    }
    await pool.query("DELETE FROM users WHERE id = $1", [id]);
    res.json({ success: true });
  } catch (err) {
    req.log?.error({ err }, "Delete user error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/broadcasts", requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { rows } = await getPool().query(
      "SELECT * FROM broadcasts ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err: any) {
    if (err.code === "42P01") { res.json([]); return; }
    req.log?.error({ err }, "List broadcasts error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/broadcasts", requireAdmin, async (req: AuthRequest, res) => {
  const { title, content, type = "info" } = req.body;
  if (!title || !content) {
    res.status(400).json({ error: "Title and content are required" });
    return;
  }
  try {
    const { rows } = await getPool().query(
      "INSERT INTO broadcasts (title, content, type, created_by) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, content, type, req.user!.userId]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    req.log?.error({ err }, "Create broadcast error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/broadcasts/:id", requireAdmin, async (req: AuthRequest, res) => {
  try {
    await getPool().query("DELETE FROM broadcasts WHERE id = $1", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    req.log?.error({ err }, "Delete broadcast error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
