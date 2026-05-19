import { Router } from "express";
import { query } from "../lib/db.js";
import { requireAdmin, type AuthRequest } from "../middlewares/requireAuth.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const result = await query("SELECT * FROM apps ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    req.log?.error({ err }, "List apps error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", requireAdmin, async (req: AuthRequest, res) => {
  const { name, url, icon_url, description } = req.body;
  if (!name || !icon_url) {
    res.status(400).json({ error: "Name and icon_url are required" });
    return;
  }
  try {
    const result = await query(
      "INSERT INTO apps (name, url, icon_url, description) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, url || null, icon_url, description || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    req.log?.error({ err }, "Create app error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", requireAdmin, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { name, url, icon_url, description } = req.body;
  try {
    const result = await query(
      "UPDATE apps SET name=$1, url=$2, icon_url=$3, description=$4 WHERE id=$5 RETURNING *",
      [name, url || null, icon_url, description || null, id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: "App not found" });
      return;
    }
    res.json(result.rows[0]);
  } catch (err) {
    req.log?.error({ err }, "Update app error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", requireAdmin, async (req: AuthRequest, res) => {
  const { id } = req.params;
  try {
    await query("DELETE FROM apps WHERE id=$1", [id]);
    res.json({ success: true });
  } catch (err) {
    req.log?.error({ err }, "Delete app error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
