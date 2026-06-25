import { Router } from "express";
import { getPool } from "../lib/db.js";
import { requireAdmin, type AuthRequest } from "../middlewares/requireAuth.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { rows } = await getPool().query("SELECT * FROM apps ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    req.log?.error({ err }, "List apps error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", requireAdmin, async (req: AuthRequest, res) => {
  const { name, url, icon_url, description } = req.body;
  if (!name) { res.status(400).json({ error: "App name is required" }); return; }
  try {
    const { rows } = await getPool().query(
      "INSERT INTO apps (name, url, icon_url, description) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, url || null, icon_url || null, description || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    req.log?.error({ err }, "Create app error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", requireAdmin, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { name, url, icon_url, description } = req.body;
  try {
    const { rows } = await getPool().query(
      "UPDATE apps SET name=$1, url=$2, icon_url=$3, description=$4 WHERE id=$5 RETURNING *",
      [name, url || null, icon_url || null, description || null, id]
    );
    if (!rows[0]) { res.status(404).json({ error: "App not found" }); return; }
    res.json(rows[0]);
  } catch (err) {
    req.log?.error({ err }, "Update app error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", requireAdmin, async (req: AuthRequest, res) => {
  try {
    await getPool().query("DELETE FROM apps WHERE id = $1", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    req.log?.error({ err }, "Delete app error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
