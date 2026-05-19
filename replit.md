# Bishal's Hub — Portfolio + SaaS Portal

A full personal portfolio and SaaS hub for Bishal Bishwokarma. Features a dark neon design, public portfolio site, user authentication, user dashboard with apps + messaging, and an admin panel.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/portfolio run dev` — run the portfolio frontend
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- Required env: `DATABASE_URL` — Replit Helium Postgres connection string
- Required env: `SESSION_SECRET` — JWT signing secret

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5 (port 8080, path `/api`)
- DB: Replit Helium PostgreSQL (direct pg pool, no Drizzle ORM)
- Auth: JWT (stored in `localStorage` as `bishals_hub_token`)
- Validation: Zod (`zod/v4`), OpenAPI codegen via Orval
- Frontend: React + Vite + Tailwind CSS + shadcn/ui
- Build: esbuild (CJS bundle for API)

## Where things live

- `artifacts/api-server/src/routes/` — Express route handlers (auth, apps, messages, admin, setup)
- `artifacts/api-server/src/lib/db.ts` — pg Pool connection using DATABASE_URL
- `artifacts/api-server/src/lib/auth.ts` — JWT sign/verify utilities
- `artifacts/api-server/src/middlewares/requireAuth.ts` — auth + admin middleware
- `artifacts/portfolio/src/pages/` — React pages (Home, Login, Register, Dashboard)
- `artifacts/portfolio/src/pages/admin/` — Admin pages (Overview, Messages, Apps, Users)
- `artifacts/portfolio/src/components/` — Navbar, Footer, AdminLayout
- `artifacts/portfolio/src/contexts/AuthContext.tsx` — global auth state
- `lib/api-client-react/` — generated React Query hooks from OpenAPI spec
- `lib/api-spec/` — OpenAPI spec source of truth

## Database Tables (Replit Helium Postgres)

- `users` — id (uuid), email, name, password_hash, role (user|admin), created_at
- `apps` — id (uuid), name, url, icon_url, description, created_at
- `messages` — id (uuid), name, email, message, user_id (nullable FK), created_at
- `replies` — id (uuid), message_id (FK), content, sender_role, sender_name, user_id, created_at

## Admin Credentials

- Email: `bishalbishwokarma089@gmail.com`
- Password: `bishal@ado@9802485583`
- Setup endpoint: `POST /api/setup-admin` with header `x-setup-secret: bishal-setup-2026`

## Architecture decisions

- Database is Replit's Helium Postgres via direct pg Pool (not Supabase REST API). Supabase SDK env vars exist but are not used for data access.
- JWT auth stored in localStorage; the custom-fetch utility automatically injects the bearer token on all API calls.
- Admin role is auto-assigned to `bishalbishwokarma089@gmail.com` on registration/setup.
- All API routes are prefixed `/api` and handled by the Express server at port 8080 via the shared proxy.
- OpenAPI spec drives codegen — never hand-write API client code; run codegen after spec changes.

## Product

- Public portfolio homepage (Hero, About, Skills, Projects, Services, Education, Contact)
- User auth: register / login with JWT, persisted in localStorage
- User dashboard: view apps hub + messaging inbox with admin reply threads
- Admin panel: overview stats, manage messages (reply), manage apps (CRUD), view users

## User preferences

- Dark neon theme (electric cyan `#00BFFF` primary, deep dark backgrounds)
- Admin email: bishalbishwokarma089@gmail.com

## Gotchas

- Do NOT use Supabase REST client for DB operations — tables are in Replit Helium Postgres, not Supabase.
- After changing OpenAPI spec, always run `pnpm --filter @workspace/api-spec run codegen`.
- `pg` must be in `dependencies` (not devDependencies) for the api-server esbuild bundle.
- The `setup-admin` endpoint must be called once after fresh deploy to seed the admin user.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
