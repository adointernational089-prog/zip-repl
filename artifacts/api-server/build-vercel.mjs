/**
 * Vercel build script.
 * Bundles the entire Express app + serverless-http wrapper into
 * ../../api/handler.js as a self-contained CJS bundle.
 * No dynamic imports, no ESM syntax issues — plain CJS that Vercel
 * can load without a "type":"module" in the root package.json.
 */
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build as esbuild } from "esbuild";

globalThis.require = createRequire(import.meta.url);

const artifactDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(artifactDir, "../../");

await esbuild({
  entryPoints: [path.resolve(artifactDir, "src/vercel-entry.ts")],
  platform: "node",
  bundle: true,
  format: "cjs",
  // Use catch-all filename so Vercel routes ALL /api/* requests here
  // and preserves the original req.url (e.g. /api/auth/login) instead
  // of rewriting it to /api/handler which breaks Express routing.
  outfile: path.resolve(repoRoot, "api/[...path].js"),
  logLevel: "info",
  external: [
    // Only exclude native addons — everything else gets inlined
    "*.node",
  ],
  sourcemap: false,
  // Vercel CJS functions require module.exports = function(req,res).
  // esbuild compiles `export default` to exports.default, so we
  // normalise the export here so Vercel finds the handler correctly.
  footer: {
    js: "module.exports = module.exports.default ?? module.exports;",
  },
});

console.log("✓ Vercel CJS handler bundle written to api/[...path].js");
