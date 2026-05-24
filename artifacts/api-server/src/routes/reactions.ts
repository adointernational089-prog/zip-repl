import { Router } from "express";
import { getPool } from "../lib/db.js";

const router = Router();
const VALID_EMOJIS = ["👏", "🔥", "😍", "💯", "⚡"];

let _tableReady: Promise<void> | null = null;
function ensureTable(): Promise<void> {
  if (!_tableReady) {
    _tableReady = getPool().query(`
      CREATE TABLE IF NOT EXISTS reactions (
        target_type TEXT NOT NULL,
        target_id   TEXT NOT NULL,
        emoji       TEXT NOT NULL,
        count       INT  NOT NULL DEFAULT 0,
        PRIMARY KEY (target_type, target_id, emoji)
      );
    `).then(() => undefined).catch((err) => {
      _tableReady = null;
      throw err;
    });
  }
  return _tableReady;
}

router.get("/", async (req: any, res) => {
  const { target_type, target_id } = req.query as { target_type?: string; target_id?: string };
  if (!target_type || !target_id) {
    res.status(400).json({ error: "target_type and target_id required" });
    return;
  }
  try {
    await ensureTable();
    const pool = getPool();
    const result = await pool.query(
      `SELECT emoji, count FROM reactions WHERE target_type = $1 AND target_id = $2`,
      [target_type, target_id]
    );
    const out: Record<string, number> = {};
    VALID_EMOJIS.forEach(e => { out[e] = 0; });
    for (const row of result.rows) {
      out[row.emoji] = row.count;
    }
    res.json(out);
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
    await ensureTable();
    const pool = getPool();
    const result = await pool.query(
      `INSERT INTO reactions (target_type, target_id, emoji, count)
       VALUES ($1, $2, $3, GREATEST(0, $4))
       ON CONFLICT (target_type, target_id, emoji)
       DO UPDATE SET count = GREATEST(0, reactions.count + $4)
       RETURNING count`,
      [target_type, target_id, emoji, delta]
    );
    res.json({ count: result.rows[0]?.count ?? 0 });
  } catch (err) {
    req.log?.error({ err }, "Post reaction error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
