import { Router } from "express";
import { getSupabase } from "../lib/db.js";
import { requireAdmin, type AuthRequest } from "../middlewares/requireAuth.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const sb = getSupabase();
    const { data, error } = await sb.from("apps").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    req.log?.error({ err }, "List apps error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", requireAdmin, async (req: AuthRequest, res) => {
  const { name, url, icon_url, description } = req.body;
  if (!name) {
    res.status(400).json({ error: "App name is required" });
    return;
  }
  try {
    const sb = getSupabase();
    const { data, error } = await sb
      .from("apps")
      .insert({ name, url: url || null, icon_url, description: description || null })
      .select()
      .single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    req.log?.error({ err }, "Create app error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", requireAdmin, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { name, url, icon_url, description } = req.body;
  try {
    const sb = getSupabase();
    const { data, error } = await sb
      .from("apps")
      .update({ name, url: url || null, icon_url, description: description || null })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    if (!data) {
      res.status(404).json({ error: "App not found" });
      return;
    }
    res.json(data);
  } catch (err) {
    req.log?.error({ err }, "Update app error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", requireAdmin, async (req: AuthRequest, res) => {
  const { id } = req.params;
  try {
    const sb = getSupabase();
    const { error } = await sb.from("apps").delete().eq("id", id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    req.log?.error({ err }, "Delete app error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
