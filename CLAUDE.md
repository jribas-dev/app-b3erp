# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Next.js dev server (http://localhost:3000)
npm run build    # Production build
npm run start    # Run production build
npm run lint     # ESLint (eslint-config-next)
```

No test runner is configured.

## Stack

- **Next.js 15.3** (App Router, RSC) + **React 19** + **TypeScript 5.9**
- **Tailwind CSS v4** (PostCSS-based, no `tailwind.config.*`; tokens live in [src/app/globals.css](src/app/globals.css))
- **shadcn/ui** ("new-york" style) — generated into [src/components/ui/](src/components/ui/); Lucide icon set
- **react-hook-form** + **zod** (`@hookform/resolvers`)
- **next-themes** for light/dark switching

Path alias: `@/* → src/*` (see [tsconfig.json](tsconfig.json)).

Required env: `BACKEND_URL` (REST API base). Auth flow also sets `NODE_ENV` to gate `secure` cookies.

## Architecture

### Two route groups under `src/app/`

- **`(site)/`** — public routes: `auth/{login,lost-password,reset-password}`, `privacy-policy`, `terms-of-service`, `user-pre`. Has its own [layout.tsx](src/app/(site)/layout.tsx).
- **`(dash)/`** — authenticated routes wrapped by [src/app/(dash)/layout.tsx](src/app/(dash)/layout.tsx) (`HeaderPrivate` + `Footer`). Subdivided by role:
  - `home/` — landing after login; also where instance selection happens when `session.instanceName` is missing.
  - `super/` — supervisor-only (`customers`, `team`, `team-performance`, `team-route`).
  - `saler/` — salers + supervisors (`orders`, `orders-history`, `performance`, `price-table`).
  - `buyer/` — buyers only (`edit`, `orders`, `orders-history`).

### Auth & session model

The app is a **frontend for an external REST backend** at `BACKEND_URL`. There are no API routes in this repo; auth state lives entirely in HTTP-only cookies set by the Next layer.

Three cookies, all `httpOnly`/`sameSite=strict`:
- `accessToken` — 15 min before instance is picked, 3 h after.
- `refreshToken` — 7 days, only issued **after** an instance is selected (`POST /auth/instance`).
- `rememberMe` — `"true"`/`"false"` flag the middleware uses to decide whether to auto-redirect a logged-in user away from `/auth/login`.

Two-stage login:
1. `POST /auth/login` → returns short-lived `accessToken` only. User lands on `/home` to pick a tenant ("instância").
2. `POST /auth/instance` with `{ dbId }` → returns longer `accessToken` + `refreshToken`. Session now has `instanceName`, `dbId`, `roleFront`, `roleBack`.

Server-side actions ("use server") in [src/lib/auth.service.ts](src/lib/auth.service.ts) own all cookie writes (`loginAction`, `selectInstanceAction`, `refreshTokenAction`, `logoutAction`, `getSessionAction`, `getUserInstancesAction`). Client components consume them through hooks in [src/hooks/](src/hooks/) (`useAuth`, `useSession`, `useUserInstances`, `useUserEdit`, `useLostPassword`).

### Middleware = the gatekeeper

[src/middleware.ts](src/middleware.ts) runs on every non-static path and is the **single source of truth for routing rules**:
- Reads `accessToken` and verifies it via `GET /backend/session`. On 401 it tries `POST /auth/refresh` and re-issues cookies inline on the `NextResponse`.
- Public-vs-protected is decided against `PUBLIC_ROUTES` / `PROTECTED_ROUTES` in [src/mocks/routes-permission.ts](src/mocks/routes-permission.ts) — **edit that file when adding a new top-level route, not the middleware.**
- `/home` is special: accessible to any authenticated user even without a tenant; all other `(dash)` routes require `session.instanceName` and redirect to `/home` if missing.
- Role gating is enforced by `session.roleFront` ∈ `PROTECTED_ROUTES[route]`. Roles: `supervisor`, `saler`, `buyer`, `notallow` (`ROLES` const in same file).

Note the middleware re-implements `getSession` / `refreshAccessToken` rather than importing from `auth.service.ts`, because middleware runs in the Edge runtime and can't use `next/headers` `cookies()`. Keep these two paths in sync when changing the auth contract.

## Project conventions

- **All UI copy is Portuguese (pt-BR).** CTAs use imperative verbs ("Salvar", "Lançar Pedido"). Error messages describe the corrective action, not the HTTP code.
- **Design tokens only** — never inline hex values; use `var(--primary)`, `var(--card)`, etc. from [src/app/globals.css](src/app/globals.css). All components must work under `.dark`.
- **Icons:** Lucide React only (`size={20}` default, `size={16}` inline).
- **shadcn primitives in [src/components/ui/](src/components/ui/) are generated — do not hand-edit.** Build new components in sibling folders (`header/`, `footer/`, `home/`) that compose them.
- **Server Actions for backend calls** — service files in [src/lib/](src/lib/) start with `"use server"` and are the only place cookies are mutated. Don't fetch the backend directly from client components; go through a hook.
- Module names shown in the dashboard come from [src/mocks/dash-items-private.ts](src/mocks/dash-items-private.ts) — match those strings exactly when referencing them in copy.

Full design contract for AI-generated UI: [agent_docs/design-rules.md](agent_docs/design-rules.md). Brand reference: [BRAND.md](BRAND.md).
