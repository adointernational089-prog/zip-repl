import { Router } from "express";
import { requireAdmin, type AuthRequest } from "../middlewares/requireAuth.js";

const router = Router();

router.post("/image", requireAdmin, async (req: AuthRequest, res) => {
  const { base64, mimeType } = req.body;
  if (!base64 || !mimeType) {
    res.status(400).json({ error: "base64 and mimeType are required" });
    return;
  }

  try {
    const dataUrl = `data:${mimeType};base64,${base64}`;
    res.json({ url: dataUrl });
  } catch (err: any) {
    req.log?.error({ err }, "Upload route error");
    res.status(500).json({ error: "Upload failed" });
  }
});

export default router;
