import { Router } from "express";
import { createClient } from "@supabase/supabase-js";
import { requireAdmin, type AuthRequest } from "../middlewares/requireAuth.js";

const router = Router();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BUCKET = "project-images";

async function ensureBucket() {
  const { data: buckets } = await supabase.storage.listBuckets();
  const exists = buckets?.some((b) => b.name === BUCKET);
  if (!exists) {
    await supabase.storage.createBucket(BUCKET, {
      public: true,
      fileSizeLimit: 10 * 1024 * 1024,
      allowedMimeTypes: ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif"],
    });
  }
}
ensureBucket().catch(() => {});

router.post("/image", requireAdmin, async (req: AuthRequest, res) => {
  const { base64, mimeType, fileName } = req.body;
  if (!base64 || !mimeType || !fileName) {
    res.status(400).json({ error: "base64, mimeType and fileName are required" });
    return;
  }

  try {
    const buffer = Buffer.from(base64, "base64");
    const ext = mimeType.split("/")[1] || "jpg";
    const key = `projects/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(key, buffer, {
        contentType: mimeType,
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      req.log?.error({ error }, "Supabase upload error");
      res.status(500).json({ error: error.message });
      return;
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(key);
    res.json({ url: data.publicUrl });
  } catch (err: any) {
    req.log?.error({ err }, "Upload route error");
    res.status(500).json({ error: "Upload failed" });
  }
});

export default router;
