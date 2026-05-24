import { Router } from "express";
import { getSupabase } from "../lib/db.js";

const router = Router();
const VALID_EMOJIS = ["👏", "🔥", "😍", "💯", "⚡"];

router.get("/", async (req: any, res) => {
  const { target_type, target_id } = req.query as { target_type?: string; target_id?: string };
  if (!target_type || !target_id) {
    res.status(400).json({ error: "target_type and target_id required" });
    return;
  }
  try {
    const sb = getSupabase();
    const { data, error } = await sb
      .from("reactions")
      .select("emoji, count")
      .eq("target_type", target_type)
      .eq("target_id", target_id);
    const result: Record<string, number> = {};
    VALID_EMOJIS.forEach(e => { result[e] = 0; });
    if (!error && data) {
      (data as any[]).forEach((row: any) => { result[row.emoji] = row.count; });
    }
    res.json(result);
  } catch (err) {
    req.log?.error({ err }, "Get reactions error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req: any, res) => {
  const { target_type, target_id, emoji, delta } = req.body;
  if (!target_type || !target_id || !emoji || (delta !== 1 && delta !== -1)) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }
  if (!VALID_EMOJIS.includes(emoji)) {
    res.status(400).json({ error: "Invalid emoji" });
    return;
  }
  try {
    const sb = getSupabase();
    const { data: existing } = await sb
      .from("reactions")
      .select("count")
      .eq("target_type", target_type)
      .eq("target_id", target_id)
      .eq("emoji", emoji)
      .single();
    const currentCount = (existing as any)?.count ?? 0;
    const newCount = Math.max(0, currentCount + delta);
    await sb.from("reactions").upsert(
      { target_type, target_id, emoji, count: newCount },
      { onConflict: "target_type,target_id,emoji" }
    );
    res.json({ count: newCount });
  } catch (err) {
    req.log?.error({ err }, "Post reaction error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
