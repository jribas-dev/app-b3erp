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

## Backend API

All backend communication goes through server actions in `src/lib/`. The REST API is documented in:
- [agent_docs/api-core.md](agent_docs/api-core.md) — auth, users, tenants, infra (S3, SES, SQL files, sys files)
- [agent_docs/api-b3vendas.md](agent_docs/api-b3vendas.md) — sales domain: clientes, produtos, pedidos, equipe, pagamentos

Key points from the API:
- Two-stage auth: `POST /auth/login` (stage 1) → `POST /auth/instance` (stage 2 with `dbId`). Stage 2 token required for all domain endpoints.
- `idemp` (empresa/emitente ID) is **not in the token** — must be sent in each request. Fetch available companies via `GET /tenant/emitentes`.
- All `/b3vendas/*` endpoints resolve the authenticated user to a **vendedor** in the tenant DB. Returns `403` if no vendedor link exists.
- `roleFront` values: `supervisor | saler | buyer | notallow`. `roleBack` values: `admin | supervisor | user | notallow`.

## Actors & Role Matrix

The application has 6 distinct actors. Routes and UI are gated by `roleFront` (and `roleBack` for backoffice/admin ops):

| # | Actor | roleFront | roleBack | Status | Routes |
|---|---|---|---|---|---|
| 1 | **Root** (Administrador do Sistema) | any | `isRoot = true` | 🔜 Planned | `/root/*` (future) |
| 2 | **Administrativo** (Dashboard, Faturamento, Financeiro) | `supervisor` | `admin` or `supervisor` | 🚧 In progress | `/super/*` |
| 3 | **Gerente de Vendas** (Vendas + Equipe) | `supervisor` | any | 🚧 In progress | `/super/*` + `/saler/*` |
| 4 | **Vendedor** | `saler` | any | 🚧 In progress | `/saler/*` |
| 5 | **Comprador** (Pedidos de Compra) | `buyer` | any | 🔜 Planned | `/buyer/*` |
| 6 | **Estoque** (Operações de Estoque) | `inventory` *(future)* | any | 🔜 Planned | `/inventory/*` (future) |

**Currently implemented (partial):** actors 2, 3, and 4.

### Route → Actor mapping (current)

- `/saler/orders` — Lançamento de Pedidos → actors 3, 4
- `/saler/orders-history` — Histórico de Pedidos → actors 3, 4
- `/saler/price-table` — Tabela de Preços → actors 3, 4
- `/saler/performance` — Analisar desempenho → actors 3, 4
- `/super/customers` — Lista de Clientes → actor 2, 3
- `/super/team` — Configurar Equipe → actor 3
- `/super/team-route` — Configurar Rota → actor 3
- `/super/team-performance` — Analisar Equipe → actor 3
- `/buyer/edit` — Dados do Comprador → actor 5
- `/buyer/orders` — Pedido de Compra → actor 5
- `/buyer/orders-history` — Histórico de Pedidos (compra) → actor 5

## Architecture

### Two route groups under `src/app/`

- **`(site)/`** — public routes: `auth/{login,lost-password,reset-password}`, `privacy-policy`, `terms-of-service`, `user-pre`. Has its own [layout.tsx](src/app/(site)/layout.tsx).
- **`(dash)/`** — authenticated routes wrapped by [src/app/(dash)/layout.tsx](src/app/(dash)/layout.tsx) (`HeaderPrivate` + `Footer`). Subdivided by role:
  - `home/` — landing after login; also where instance selection happens when `session.instanceName` is missing.
  - `super/` — supervisor role: management (customers, team, team-performance, team-route) — actors 2 and 3.
  - `saler/` — saler + supervisor roles: sales operations (orders, orders-history, performance, price-table) — actors 3 and 4.
  - `buyer/` — buyer role only: purchase orders (edit, orders, orders-history) — actor 5.

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
- Role gating is enforced by `session.roleFront` ∈ `PROTECTED_ROUTES[route]`. Active roles: `supervisor`, `saler`, `buyer`, `notallow` (`ROLES` const in same file). Future roles (`inventory`) will require adding to that file.

Note the middleware re-implements `getSession` / `refreshAccessToken` rather than importing from `auth.service.ts`, because middleware runs in the Edge runtime and can't use `next/headers` `cookies()`. Keep these two paths in sync when changing the auth contract.

## Project conventions

- **Mobile First — Portrait priority.** The app runs on phones in portrait mode. Every page and component must work at ≥360px wide first. Use `sm:` breakpoints only as progressive enhancement. Test all new UI at 360×780px before larger screens. Never use `truncate` to hide content that the user needs — reflow the layout instead.
- **All UI copy is Portuguese (pt-BR).** CTAs use imperative verbs ("Salvar", "Lançar Pedido"). Error messages describe the corrective action, not the HTTP code.
- **Design tokens only** — never inline hex values; use `var(--primary)`, `var(--card)`, etc. from [src/app/globals.css](src/app/globals.css). All components must work under `.dark`.
- **Icons:** Lucide React only (`size={20}` default, `size={16}` inline).
- **shadcn primitives in [src/components/ui/](src/components/ui/) are generated — do not hand-edit.** Build new components in sibling folders (`header/`, `footer/`, `home/`) that compose them.
- **Server Actions for backend calls** — service files in [src/lib/](src/lib/) start with `"use server"` and are the only place cookies are mutated. Don't fetch the backend directly from client components; go through a hook.
- Module names shown in the dashboard come from [src/mocks/dash-items-private.ts](src/mocks/dash-items-private.ts) — match those strings exactly when referencing them in copy.

Full design contract for AI-generated UI: [agent_docs/design-rules.md](agent_docs/design-rules.md). Brand reference: [BRAND.md](BRAND.md).
