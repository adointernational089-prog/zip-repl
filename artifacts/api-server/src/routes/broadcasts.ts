import { Router } from "express";
import { getSupabase } from "../lib/db.js";

const router = Router();

router.get("/", async (req: any, res) => {
  try {
    const sb = getSupabase();
    const { data, error } = await sb
      .from("broadcasts")
      .select("id, title, content, type, created_at")
      .order("created_at", { ascending: false });
    if (error && (error as any).code === "42P01") {
      res.json([]);
      return;
    }
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    req.log?.error({ err }, "Get broadcasts error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
