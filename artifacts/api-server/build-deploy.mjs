/**
 * Universal deploy build script.
 *
 * Produces a self-contained deploy/ folder at the repo root:
 *
 *   deploy/
 *   ├── server.js      ← single CJS bundle, ALL deps inlined, no npm install needed
 *   ├── public/        ← built React app (HTML + JS + CSS)
 *   └── package.json   ← { "scripts": { "start": "node server.js" } }
 *
 * Upload the deploy/ folder to ANY Node.js host (Hostinger VPS, DigitalOcean,
 * Railway, Render, Heroku, Fly.io, etc.) and run:
 *
 *   PORT=3000 SUPABASE_SERVICE_ROLE_KEY=... SESSION_SECRET=... node server.js
 */
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build as esbuild } from "esbuild";
import { execSync } from "node:child_process";
import fs from "node:fs";

globalThis.require = createRequire(import.meta.url);

const artifactDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot    = path.resolve(artifactDir, "../../");
const deployDir   = path.resolve(repoRoot, "deploy");

// ── 1. Clean output dir ──────────────────────────────────────────────────────
fs.rmSync(deployDir, { recursive: true, force: true });
fs.mkdirSync(deployDir, { recursive: true });
console.log("🧹 Cleaned deploy/");

// ── 2. Build React frontend ──────────────────────────────────────────────────
console.log("⚛️  Building React frontend...");
execSync("BASE_PATH=/ pnpm --filter @workspace/portfolio run build", {
  cwd: repoRoot,
  stdio: "inherit",
});

fs.cpSync(
  path.join(repoRoot, "artifacts/portfolio/dist/public"),
  path.join(deployDir, "public"),
  { recursive: true },
);
console.log("✓ Frontend → deploy/public/");

// ── 3. Bundle Express server ─────────────────────────────────────────────────
console.log("📦 Bundling server...");
await esbuild({
  entryPoints: [path.resolve(artifactDir, "src/index-deploy.ts")],
  platform: "node",
  bundle: true,
  format: "cjs",
  outfile: path.resolve(deployDir, "server.js"),
  logLevel: "info",
  external: ["*.node"],
  sourcemap: false,
  minify: false,
  // Banner runs before any module code. Sets NODE_ENV and STATIC_DIR so the
  // Express app knows where to find the React build in a standalone context.
  banner: {
    js: [
      "/* Bishal's Hub — Production Server */",
      "if (!process.env.NODE_ENV) process.env.NODE_ENV = 'production';",
      "else process.env.NODE_ENV = 'production';",
      "if (!process.env.STATIC_DIR) process.env.STATIC_DIR = require('path').join(__dirname, 'public');",
    ].join("\n"),
  },
});
console.log("✓ Server → deploy/server.js");

// ── 4. Write minimal package.json ────────────────────────────────────────────
fs.writeFileSync(
  path.join(deployDir, "package.json"),
  JSON.stringify(
    {
      name: "bishals-hub",
      version: "1.0.0",
      description: "Bishal's Hub — Portfolio + SaaS Portal",
      scripts: { start: "node server.js" },
      engines: { node: ">=20" },
    },
    null,
    2,
  ) + "\n",
);

// ── 5. Write .env.example ────────────────────────────────────────────────────
fs.writeFileSync(
  path.join(deployDir, ".env.example"),
  [
    "# Required environment variables",
    "SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here",
    "SESSION_SECRET=bishal-hub-secret-key-2026",
    "PORT=3000",
    "",
  ].join("\n"),
);

console.log(`
✅  Deploy package ready in ./deploy/

    Required env vars:
      SUPABASE_SERVICE_ROLE_KEY=<your key>
      SESSION_SECRET=bishal-hub-secret-key-2026
      PORT=3000  (optional, defaults to 3000)

    To run locally:
      cd deploy && node server.js

    To host on any platform:
      Upload the deploy/ folder and run: node server.js
`);
