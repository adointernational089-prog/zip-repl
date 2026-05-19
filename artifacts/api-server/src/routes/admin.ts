import { Router } from "express";
import { getSupabase } from "../lib/db.js";
import { requireAdmin, type AuthRequest } from "../middlewares/requireAuth.js";

const router = Router();

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

export default router;
