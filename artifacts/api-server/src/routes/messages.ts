import { Router } from "express";
import { query } from "../lib/db.js";
import { requireAuth, requireAdmin, type AuthRequest } from "../middlewares/requireAuth.js";

const router = Router();

router.get("/", requireAdmin, async (req: AuthRequest, res) => {
  try {
    const result = await query(`
      SELECT m.*, COUNT(r.id)::int AS reply_count
      FROM messages m
      LEFT JOIN replies r ON r.message_id = m.id
      GROUP BY m.id
      ORDER BY m.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    req.log?.error({ err }, "List messages error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  const { name, email, message, user_id } = req.body;
  if (!name || !email || !message) {
    res.status(400).json({ error: "Name, email and message are required" });
    return;
  }
  try {
    const result = await query(
      "INSERT INTO messages (name, email, message, user_id) VALUES ($1, $2, $3, $4) RETURNING *, 0 AS reply_count",
      [name, email, message, user_id || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    req.log?.error({ err }, "Send message error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/my", requireAuth, async (req: AuthRequest, res) => {
  try {
    const result = await query(`
      SELECT m.*, COUNT(r.id)::int AS reply_count
      FROM messages m
      LEFT JOIN replies r ON r.message_id = m.id
      WHERE m.user_id = $1
      GROUP BY m.id
      ORDER BY m.created_at DESC
    `, [req.user!.userId]);
    res.json(result.rows);
  } catch (err) {
    req.log?.error({ err }, "Get my messages error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", requireAuth, async (req: AuthRequest, res) => {
  const { id } = req.params;
  try {
    const msgResult = await query("SELECT * FROM messages WHERE id=$1 LIMIT 1", [id]);
    if (msgResult.rows.length === 0) {
      res.status(404).json({ error: "Message not found" });
      return;
    }
    const msg = msgResult.rows[0];
    if (req.user!.role !== "admin" && msg.user_id !== req.user!.userId) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    const repliesResult = await query(
      "SELECT * FROM replies WHERE message_id=$1 ORDER BY created_at ASC",
      [id]
    );
    res.json({ ...msg, replies: repliesResult.rows });
  } catch (err) {
    req.log?.error({ err }, "Get message error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/:id/replies", requireAuth, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { content } = req.body;
  if (!content) {
    res.status(400).json({ error: "Content is required" });
    return;
  }
  try {
    const msgResult = await query("SELECT id, user_id FROM messages WHERE id=$1 LIMIT 1", [id]);
    if (msgResult.rows.length === 0) {
      res.status(404).json({ error: "Message not found" });
      return;
    }
    const msg = msgResult.rows[0];
    const isAdmin = req.user!.role === "admin";
    if (!isAdmin && msg.user_id !== req.user!.userId) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    const senderName = isAdmin ? "Bishal Bishwokarma" : req.user!.email;
    const result = await query(
      "INSERT INTO replies (message_id, content, sender_role, sender_name, user_id) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [id, content, req.user!.role, senderName, req.user!.userId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    req.log?.error({ err }, "Reply error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
