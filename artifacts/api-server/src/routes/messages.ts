import { Router } from "express";
import { getSupabase } from "../lib/db.js";
import { requireAuth, requireAdmin, type AuthRequest } from "../middlewares/requireAuth.js";

const router = Router();

router.get("/", requireAdmin, async (req: AuthRequest, res) => {
  try {
    const sb = getSupabase();
    const { data: messages, error } = await sb
      .from("messages")
      .select("*, replies(id)")
      .order("created_at", { ascending: false });
    if (error) throw error;
    const result = (messages || []).map((m: any) => ({
      ...m,
      reply_count: m.replies ? m.replies.length : 0,
      replies: undefined,
    }));
    res.json(result);
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
    const sb = getSupabase();
    const { data, error } = await sb
      .from("messages")
      .insert({ name, email, message, user_id: user_id || null })
      .select()
      .single();
    if (error) throw error;
    res.status(201).json({ ...data, reply_count: 0 });
  } catch (err) {
    req.log?.error({ err }, "Send message error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/my", requireAuth, async (req: AuthRequest, res) => {
  try {
    const sb = getSupabase();
    const { data: messages, error } = await sb
      .from("messages")
      .select("*, replies(id)")
      .eq("user_id", req.user!.userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    const result = (messages || []).map((m: any) => ({
      ...m,
      reply_count: m.replies ? m.replies.length : 0,
      replies: undefined,
    }));
    res.json(result);
  } catch (err) {
    req.log?.error({ err }, "Get my messages error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", requireAuth, async (req: AuthRequest, res) => {
  const { id } = req.params;
  try {
    const sb = getSupabase();
    const { data: msg, error: msgErr } = await sb.from("messages").select("*").eq("id", id).single();
    if (msgErr || !msg) {
      res.status(404).json({ error: "Message not found" });
      return;
    }
    if (req.user!.role !== "admin" && msg.user_id !== req.user!.userId) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    const { data: replies, error: repliesErr } = await sb
      .from("replies")
      .select("*")
      .eq("message_id", id)
      .order("created_at", { ascending: true });
    if (repliesErr) throw repliesErr;
    res.json({ ...msg, replies: replies || [] });
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
    const sb = getSupabase();
    const { data: msg, error: msgErr } = await sb.from("messages").select("id, user_id").eq("id", id).single();
    if (msgErr || !msg) {
      res.status(404).json({ error: "Message not found" });
      return;
    }
    const isAdmin = req.user!.role === "admin";
    if (!isAdmin && msg.user_id !== req.user!.userId) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    const senderName = isAdmin ? "Bishal Bishwokarma" : req.user!.email;
    const { data, error } = await sb
      .from("replies")
      .insert({ message_id: id, content, sender_role: req.user!.role, sender_name: senderName, user_id: req.user!.userId })
      .select()
      .single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    req.log?.error({ err }, "Reply error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
