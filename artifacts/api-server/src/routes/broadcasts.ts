import { Router } from "express";
import { getPool } from "../lib/db.js";

const router = Router();

router.get("/", async (req: any, res) => {
  try {
    const { rows } = await getPool().query(
      "SELECT id, title, content, type, created_at FROM broadcasts ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err: any) {
    if (err.code === "42P01") { res.json([]); return; }
    req.log?.error({ err }, "Get broadcasts error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
