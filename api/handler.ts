import type { VercelRequest, VercelResponse } from "@vercel/node";
import serverless from "serverless-http";
import app from "../artifacts/api-server/src/app.js";

const handle = serverless(app);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  return handle(req as any, res as any);
}
