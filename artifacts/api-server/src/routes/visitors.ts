import { Router } from "express";
import { getPool } from "../lib/db.js";

const router = Router();

let _tableReady: Promise<void> | null = null;
function ensureTable(): Promise<void> {
  if (!_tableReady) {
    _tableReady = getPool().query(`
      CREATE TABLE IF NOT EXISTS page_views (
        id         BIGSERIAL PRIMARY KEY,
        session_id TEXT NOT NULL,
        path       TEXT NOT NULL DEFAULT '/',
        viewed_at  TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_page_views_viewed_at ON page_views(viewed_at);
      CREATE INDEX IF NOT EXISTS idx_page_views_session   ON page_views(session_id);
    `).then(() => undefined).catch((err) => {
      _tableReady = null;
      throw err;
    });
  }
  return _tableReady;
}

router.post("/", async (req: any, res) => {
  const { session_id, path = "/" } = req.body;
  if (!session_id) {
    res.status(400).json({ error: "session_id required" });
    return;
  }
  try {
    await ensureTable();
    const pool = getPool();
    const recent = await pool.query(
      `SELECT id FROM page_views
       WHERE session_id = $1 AND path = $2
         AND viewed_at > NOW() - INTERVAL '30 minutes'
       LIMIT 1`,
      [session_id, path]
    );
    if ((recent.rowCount ?? 0) === 0) {
      await pool.query(
        `INSERT INTO page_views (session_id, path) VALUES ($1, $2)`,
        [session_id, path]
      );
    }
    res.json({ recorded: (recent.rowCount ?? 0) === 0 });
  } catch (err) {
    req.log?.error({ err }, "Record visit error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", async (req: any, res) => {
  try {
    await ensureTable();
    const pool = getPool();
    const result = await pool.query(`
      SELECT
        COUNT(DISTINCT session_id) FILTER (WHERE viewed_at > NOW() - INTERVAL '24 hours') AS today,
        COUNT(DISTINCT session_id) FILTER (WHERE viewed_at > NOW() - INTERVAL '7 days')  AS week,
        COUNT(DISTINCT session_id) AS total
      FROM page_views
    `);
    const row = result.rows[0];
    res.json({
      today: parseInt(row.today)  || 0,
      week:  parseInt(row.week)   || 0,
      total: parseInt(row.total)  || 0,
    });
  } catch (err) {
    req.log?.error({ err }, "Get visitor stats error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
