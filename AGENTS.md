# SAHARA Support Platform

Full-Stack Application built with **Next.js (App Router)**, **React 19**, **Tailwind CSS v4**, and a built-in **Node.js SQLite database (`node:sqlite`)**.

> **Note to AI Agents:** Payload CMS has been intentionally removed from this project. Do not generate, reference, or install Payload CMS configurations, collections, or plugins.

---

## Architecture Overview

- **Framework:** Next.js (App Router with Server Actions & Route Handlers)
- **Frontend UI:** React 19 + Tailwind CSS v4 + Lucide Icons + Motion
- **Database & Data Layer:** Local zero-dependency SQLite database powered by `node:sqlite` (`src/lib/db.ts`). Stored at `data/app.db`.
- **Authentication:** Custom session-cookie authentication with SHA-256 password hashing (`src/lib/auth.ts`, `src/app/(frontend)/login/actions.ts`).
- **Route Protection:** Handled via Next.js middleware in `src/middleware.ts` (protects `/community`, `/support`, `/resources`, `/about` so only authenticated users can access them).

---

## Directory Structure

- `src/app/(frontend)/` - Application pages (Home, Community, Support, Resources, About, Login)
- `src/app/api/` - Next.js REST API routes (`/api/posts`, `/api/bookings`, `/api/posts/[id]/replies`, `/api/posts/[id]/vote`)
- `src/components/` - Reusable UI components (`SaharaShell.tsx`, `CommunityForum.tsx`, `BookingFlow.tsx`, `SaharaStaticPages.tsx`)
- `src/lib/` - Shared utilities:
  - `db.ts` - Native SQLite database connection, table schemas, and seeding.
  - `auth.ts` - User session management and password hashing.
- `data/` - Holds `app.db` (auto-created on runtime).

---

## Development & Build Commands

- **Start Dev Server:** `npm run dev` (Runs on `http://localhost:3000`)
- **Build Production:** `npm run build`
- **Start Production:** `npm run start`

---

## Coding Guidelines

1. **Database Queries:** Perform database operations using the singleton `db` instance from `@/lib/db`. Use parameterized queries (`?`) to prevent SQL injection.
2. **Server Actions:** Keep Server Actions in `actions.ts` files marked `'use server'`. Remember that `'use server'` files can only export async functions; non-function values and types must be placed in separate `types.ts` files.
3. **Styling:** Use standard Tailwind CSS utility classes.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
