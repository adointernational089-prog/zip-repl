/**
 * Vercel build script.
 * Bundles the entire Express app into api/index.js as a self-contained CJS bundle.
 * vercel.json rewrites ALL /api/* requests to /api/index, so Express sees the
 * original req.url (e.g. /api/account/login) and routes correctly.
 */
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build as esbuild } from "esbuild";

globalThis.require = createRequire(import.meta.url);

const artifactDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot    = path.resolve(artifactDir, "../../");

await esbuild({
  entryPoints: [path.resolve(artifactDir, "src/vercel-entry.ts")],
  platform: "node",
  bundle: true,
  format: "cjs",
  outfile: path.resolve(repoRoot, "api/index.js"),
  logLevel: "info",
  external: ["*.node"],
  sourcemap: false,
  // Lock NODE_ENV to production at build time so pino-pretty is never
  // loaded (it uses worker threads that break in a bundled CJS context).
  define: { "process.env.NODE_ENV": JSON.stringify("production") },
  footer: {
    js: "module.exports = module.exports.default ?? module.exports;",
  },
});

console.log("✓ Vercel CJS handler bundle written to api/index.js");
