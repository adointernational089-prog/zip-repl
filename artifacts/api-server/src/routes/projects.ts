import { Router } from "express";
import { getSupabase } from "../lib/db.js";
import { requireAdmin, type AuthRequest } from "../middlewares/requireAuth.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const sb = getSupabase();
    const { data, error } = await sb.from("projects").select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: false });
    if (error) throw error;
    const projects = (data || []).map((p: any) => ({
      ...p,
      images: p.images ? JSON.parse(p.images) : [],
    }));
    res.json(projects);
  } catch (err) {
    req.log?.error({ err }, "List projects error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", requireAdmin, async (req: AuthRequest, res) => {
  const { title, description, images, tech_stack, link_url, status, sort_order } = req.body;
  if (!title) {
    res.status(400).json({ error: "Title is required" });
    return;
  }
  try {
    const sb = getSupabase();
    const { data, error } = await sb
      .from("projects")
      .insert({
        title,
        description: description || null,
        images: JSON.stringify(images || []),
        tech_stack: tech_stack || null,
        link_url: link_url || null,
        status: status || "in-progress",
        sort_order: sort_order ?? 0,
      })
      .select()
      .single();
    if (error) throw error;
    res.status(201).json({ ...data, images: JSON.parse(data.images || "[]") });
  } catch (err) {
    req.log?.error({ err }, "Create project error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", requireAdmin, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { title, description, images, tech_stack, link_url, status, sort_order } = req.body;
  try {
    const sb = getSupabase();
    const { data, error } = await sb
      .from("projects")
      .update({
        title,
        description: description || null,
        images: JSON.stringify(images || []),
        tech_stack: tech_stack || null,
        link_url: link_url || null,
        status: status || "in-progress",
        sort_order: sort_order ?? 0,
      })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    if (!data) {
      res.status(404).json({ error: "Project not found" });
      return;
    }
    res.json({ ...data, images: JSON.parse(data.images || "[]") });
  } catch (err) {
    req.log?.error({ err }, "Update project error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", requireAdmin, async (req: AuthRequest, res) => {
  const { id } = req.params;
  try {
    const sb = getSupabase();
    const { error } = await sb.from("projects").delete().eq("id", id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    req.log?.error({ err }, "Delete project error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
