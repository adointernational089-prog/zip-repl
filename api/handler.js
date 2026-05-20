import serverless from "serverless-http";

let _handle = null;

async function getHandle() {
  if (!_handle) {
    const mod = await import("../artifacts/api-server/dist-vercel/app.mjs");
    _handle = serverless(mod.default);
  }
  return _handle;
}

export default async function handler(req, res) {
  const h = await getHandle();
  return h(req, res);
}
