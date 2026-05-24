import { Router } from "express";
import bcrypt from "bcryptjs";
import { getSupabase } from "../lib/db.js";
import { requireAdmin, type AuthRequest } from "../middlewares/requireAuth.js";

const router = Router();
const ADMIN_EMAIL = "bishalbishwokarma089@gmail.com";

router.get("/stats", requireAdmin, async (req: AuthRequest, res) => {
  try {
    const sb = getSupabase();
    const [msgs, users, apps, replies] = await Promise.all([
      sb.from("messages").select("id", { count: "exact", head: true }),
      sb.from("users").select("id", { count: "exact", head: true }),
      sb.from("apps").select("id", { count: "exact", head: true }),
      sb.from("replies").select("message_id"),
    ]);
    const repliedMessageIds = new Set((replies.data || []).map((r: any) => r.message_id));
    const { data: allMsgs } = await sb.from("messages").select("id");
    const unread = (allMsgs || []).filter((m: any) => !repliedMessageIds.has(m.id)).length;
    res.json({
      total_messages: msgs.count ?? 0,
      total_users: users.count ?? 0,
      total_apps: apps.count ?? 0,
      unread_messages: unread,
    });
  } catch (err) {
    req.log?.error({ err }, "Admin stats error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/users", requireAdmin, async (req: AuthRequest, res) => {
  try {
    const sb = getSupabase();
    const { data, error } = await sb
      .from("users")
      .select("id, email, name, role, created_at")
      .order("created_at", { ascending: false });
    if (error) throw error;
    res.json(data);
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
    const sb = getSupabase();
    const { data: existing } = await sb.from("users").select("id").eq("email", email).limit(1).single();
    if (existing) {
      res.status(409).json({ error: "Email already exists" });
      return;
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const assignedRole = email === ADMIN_EMAIL ? "admin" : (role === "admin" ? "admin" : "user");
    const { data, error } = await sb
      .from("users")
      .insert({ email, name, password_hash: passwordHash, role: assignedRole })
      .select("id, email, name, role, created_at")
      .single();
    if (error || !data) {
      req.log?.error({ err: error }, "Admin create user insert error");
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.status(201).json(data);
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
    const sb = getSupabase();
    const { data: target } = await sb.from("users").select("email").eq("id", id).single();
    if (target?.email === ADMIN_EMAIL) {
      res.status(400).json({ error: "Cannot delete the primary admin account" });
      return;
    }
    const { error } = await sb.from("users").delete().eq("id", id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    req.log?.error({ err }, "Delete user error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/broadcasts", requireAdmin, async (req: AuthRequest, res) => {
  try {
    const sb = getSupabase();
    const { data, error } = await sb
      .from("broadcasts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error && (error as any).code === "42P01") { res.json([]); return; }
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
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
    const sb = getSupabase();
    const { data, error } = await sb
      .from("broadcasts")
      .insert({ title, content, type, created_by: req.user!.userId })
      .select()
      .single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    req.log?.error({ err }, "Create broadcast error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/broadcasts/:id", requireAdmin, async (req: AuthRequest, res) => {
  try {
    const sb = getSupabase();
    const { error } = await sb.from("broadcasts").delete().eq("id", req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    req.log?.error({ err }, "Delete broadcast error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
