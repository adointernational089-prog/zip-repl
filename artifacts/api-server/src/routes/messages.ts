import { Router } from "express";
import { getPool } from "../lib/db.js";
import { requireAuth, requireAdmin, type AuthRequest } from "../middlewares/requireAuth.js";
import { sendReplyNotification, sendNewMessageAlert } from "../lib/email.js";

const router = Router();

router.get("/", requireAdmin, async (req: AuthRequest, res) => {
  try {
    const pool = getPool();
    const { rows: messages } = await pool.query("SELECT * FROM messages ORDER BY created_at DESC");
    const { rows: replyCounts } = await pool.query(
      "SELECT message_id, COUNT(*) as count FROM replies GROUP BY message_id"
    );
    const countMap = new Map(replyCounts.map((r: any) => [r.message_id, parseInt(r.count, 10)]));
    res.json(messages.map((m: any) => ({ ...m, reply_count: countMap.get(m.id) ?? 0 })));
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
    const { rows } = await getPool().query(
      "INSERT INTO messages (name, email, message, user_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, message, user_id || null]
    );
    sendNewMessageAlert({ senderName: name, senderEmail: email, messageContent: message }).catch(() => {});
    res.status(201).json({ ...rows[0], reply_count: 0 });
  } catch (err) {
    req.log?.error({ err }, "Send message error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/my", requireAuth, async (req: AuthRequest, res) => {
  try {
    const pool = getPool();
    const { rows: messages } = await pool.query(
      "SELECT * FROM messages WHERE user_id = $1 ORDER BY created_at DESC",
      [req.user!.userId]
    );
    const { rows: replyCounts } = await pool.query(
      "SELECT message_id, COUNT(*) as count FROM replies GROUP BY message_id"
    );
    const countMap = new Map(replyCounts.map((r: any) => [r.message_id, parseInt(r.count, 10)]));
    res.json(messages.map((m: any) => ({ ...m, reply_count: countMap.get(m.id) ?? 0 })));
  } catch (err) {
    req.log?.error({ err }, "Get my messages error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", requireAuth, async (req: AuthRequest, res) => {
  const { id } = req.params;
  try {
    const pool = getPool();
    const { rows: msgRows } = await pool.query("SELECT * FROM messages WHERE id = $1", [id]);
    const msg = msgRows[0];
    if (!msg) { res.status(404).json({ error: "Message not found" }); return; }
    if (req.user!.role !== "admin" && msg.user_id !== req.user!.userId) {
      res.status(403).json({ error: "Forbidden" }); return;
    }
    const { rows: replies } = await pool.query(
      "SELECT * FROM replies WHERE message_id = $1 ORDER BY created_at ASC", [id]
    );
    res.json({ ...msg, replies });
  } catch (err) {
    req.log?.error({ err }, "Get message error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/:id/replies", requireAuth, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { content } = req.body;
  if (!content) { res.status(400).json({ error: "Content is required" }); return; }
  try {
    const pool = getPool();
    const { rows: msgRows } = await pool.query(
      "SELECT id, user_id, email, name, message FROM messages WHERE id = $1", [id]
    );
    const msg = msgRows[0];
    if (!msg) { res.status(404).json({ error: "Message not found" }); return; }
    const isAdmin = req.user!.role === "admin";
    if (!isAdmin && msg.user_id !== req.user!.userId) {
      res.status(403).json({ error: "Forbidden" }); return;
    }
    const senderName = isAdmin ? "Bishal Bishwokarma" : req.user!.email;
    const { rows } = await pool.query(
      "INSERT INTO replies (message_id, content, sender_role, sender_name, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [id, content, req.user!.role, senderName, req.user!.userId]
    );
    if (isAdmin && msg.email) {
      sendReplyNotification({
        toEmail: msg.email,
        toName: msg.name || "there",
        originalMessage: msg.message || "",
        replyContent: content,
        replyFrom: "Bishal Bishwokarma",
      }).catch(() => {});
    }
    res.status(201).json(rows[0]);
  } catch (err) {
    req.log?.error({ err }, "Reply error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
