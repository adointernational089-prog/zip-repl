import { Router } from "express";
import { query } from "../lib/db.js";
import { requireAdmin, type AuthRequest } from "../middlewares/requireAuth.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const result = await query("SELECT * FROM projects ORDER BY sort_order ASC, created_at DESC");
    const projects = result.rows.map((p: any) => ({
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
    const result = await query(
      "INSERT INTO projects (title, description, images, tech_stack, link_url, status, sort_order) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *",
      [
        title,
        description || null,
        JSON.stringify(images || []),
        tech_stack || null,
        link_url || null,
        status || "in-progress",
        sort_order ?? 0,
      ]
    );
    const p = result.rows[0];
    res.status(201).json({ ...p, images: JSON.parse(p.images || "[]") });
  } catch (err) {
    req.log?.error({ err }, "Create project error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", requireAdmin, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { title, description, images, tech_stack, link_url, status, sort_order } = req.body;
  try {
    const result = await query(
      "UPDATE projects SET title=$1, description=$2, images=$3, tech_stack=$4, link_url=$5, status=$6, sort_order=$7 WHERE id=$8 RETURNING *",
      [
        title,
        description || null,
        JSON.stringify(images || []),
        tech_stack || null,
        link_url || null,
        status || "in-progress",
        sort_order ?? 0,
        id,
      ]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Project not found" });
      return;
    }
    const p = result.rows[0];
    res.json({ ...p, images: JSON.parse(p.images || "[]") });
  } catch (err) {
    req.log?.error({ err }, "Update project error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", requireAdmin, async (req: AuthRequest, res) => {
  const { id } = req.params;
  try {
    await query("DELETE FROM projects WHERE id=$1", [id]);
    res.json({ success: true });
  } catch (err) {
    req.log?.error({ err }, "Delete project error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
