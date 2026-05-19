import { Router } from "express";
import { query } from "../lib/db.js";
import { requireAdmin, type AuthRequest } from "../middlewares/requireAuth.js";

const router = Router();

router.get("/stats", requireAdmin, async (req: AuthRequest, res) => {
  try {
    const [msgs, users, apps, unread] = await Promise.all([
      query("SELECT COUNT(*)::int AS count FROM messages"),
      query("SELECT COUNT(*)::int AS count FROM users"),
      query("SELECT COUNT(*)::int AS count FROM apps"),
      query(`
        SELECT COUNT(*)::int AS count FROM messages m
        WHERE NOT EXISTS (SELECT 1 FROM replies r WHERE r.message_id = m.id)
      `),
    ]);
    res.json({
      total_messages: msgs.rows[0].count,
      total_users: users.rows[0].count,
      total_apps: apps.rows[0].count,
      unread_messages: unread.rows[0].count,
    });
  } catch (err) {
    req.log?.error({ err }, "Admin stats error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/users", requireAdmin, async (req: AuthRequest, res) => {
  try {
    const result = await query("SELECT id, email, name, role, created_at FROM users ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    req.log?.error({ err }, "List users error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
