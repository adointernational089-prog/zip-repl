import type { VercelRequest, VercelResponse } from "@vercel/node";
import serverless from "serverless-http";

let _handle: ReturnType<typeof serverless> | null = null;

async function getHandle() {
  if (!_handle) {
    // Import the pre-built esbuild bundle — avoids workspace dep resolution issues
    const mod = (await import("../artifacts/api-server/dist-vercel/app.mjs")) as any;
    _handle = serverless(mod.default);
  }
  return _handle;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const h = await getHandle();
  return h(req as any, res as any);
}
