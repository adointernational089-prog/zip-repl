import type { VercelRequest, VercelResponse } from "@vercel/node";
import serverless from "serverless-http";

let _handler: ReturnType<typeof serverless> | null = null;

async function getHandler() {
  if (!_handler) {
    const { default: app } = await import("../artifacts/api-server/src/app.js");
    _handler = serverless(app);
  }
  return _handler;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const h = await getHandler();
  return h(req as any, res as any);
}
