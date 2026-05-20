import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build as esbuild } from "esbuild";
import { rm } from "node:fs/promises";

globalThis.require = createRequire(import.meta.url);

const artifactDir = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(artifactDir, "dist-vercel");

await rm(distDir, { recursive: true, force: true });

await esbuild({
  entryPoints: [path.resolve(artifactDir, "src/app-vercel.ts")],
  platform: "node",
  bundle: true,
  format: "esm",
  outfile: path.resolve(distDir, "app.mjs"),
  logLevel: "info",
  // Externalize everything that can't be statically bundled
  external: [
    "*.node",
    // Pino uses dynamic worker threads — keep as external
    "pino",
    "pino-http",
    "pino-pretty",
    "thread-stream",
    // Other common externals
    "sharp",
    "better-sqlite3",
    "sqlite3",
    "canvas",
    "bcrypt",
    "argon2",
    "fsevents",
    "re2",
    "farmhash",
    "bufferutil",
    "utf-8-validate",
    "pg-native",
    "oracledb",
    "mongodb-client-encryption",
    "nodemailer",
    "knex",
    "typeorm",
    "sequelize",
    "mysql2",
    "workerd",
    "wrangler",
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

console.log("✓ Vercel API bundle written to dist-vercel/app.mjs");
