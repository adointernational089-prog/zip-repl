/**
 * Vercel build script.
 * Bundles the entire Express app + serverless-http wrapper into
 * ../../api/handler.js so Vercel deploys it as a single self-contained
 * serverless function — no dynamic imports, no path resolution issues.
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
  format: "esm",
  // Overwrite api/handler.js with the complete self-contained bundle
  outfile: path.resolve(repoRoot, "api/handler.js"),
  logLevel: "info",
  external: [
    // Only exclude native addons — everything else gets inlined
    "*.node",
  ],
  sourcemap: false,
  banner: {
    js: `import { createRequire as __bannerCrReq } from 'node:module';
import __bannerPath from 'node:path';
import __bannerUrl from 'node:url';
globalThis.require = __bannerCrReq(import.meta.url);
globalThis.__filename = __bannerUrl.fileURLToPath(import.meta.url);
globalThis.__dirname = __bannerPath.dirname(globalThis.__filename);
`,
  },
});

console.log("✓ Vercel handler bundle written to api/handler.js");
