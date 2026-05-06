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

Required env:
- `BACKEND_URL` — REST API base.
- `JWT_SECRET` — segredo HS256 compartilhado com o backend. O middleware verifica o JWT localmente (sem round-trip a `/backend/session`) — se o secret divergir do backend, todas as sessões viram inválidas. `NODE_ENV` também é lido para gate de cookies `secure`.

## Backend API

All backend communication goes through server actions in `src/lib/`. The REST API is documented in:
- [agent_docs/api-core.md](agent_docs/api-core.md) — auth, users, tenants, infra (S3, SES, SQL files, sys files)
- [agent_docs/api-b3vendas.md](agent_docs/api-b3vendas.md) — sales domain: clientes, produtos, pedidos, equipe, pagamentos

Key points from the API:
- Two-stage auth: `POST /auth/login` (stage 1) → `POST /auth/instance` (stage 2 with `dbId`). Stage 2 token required for all domain endpoints.
- `idemp` (empresa/emitente ID) is **not in the token** — must be sent in each request. Fetch available companies via `GET /tenant/emitentes`.
- All `/b3vendas/*` endpoints resolve the authenticated user to a **vendedor** in the tenant DB. Returns `403` if no vendedor link exists.
- `roleFront` is a **string array** (`string[]`) — usuários podem acumular múltiplas funções (ex.: o dono que é `admin` + `supersaler` + `saler`). Exceção: na área de vendas é mutuamente exclusivo — o usuário é `saler` **ou** `supersaler`, nunca os dois. Valores possíveis: `admin | supersaler | saler | buyer | inventory | notallow`. `roleBack` permanece string única: `admin | supervisor | user | notallow`.

## Actors & Role Matrix

The application has 6 distinct actors. Routes and UI are gated by `roleFront` (and `roleBack` for backoffice/admin ops):

| # | Actor | roleFront | roleBack | Status | Routes |
|---|---|---|---|---|---|
| 1 | **Root** (Administrador do Sistema) | any | `isRoot = true` | 🔜 Planned | `/root/*` (future) |
| 2 | **Administrativo** (Dashboard, Faturamento, Financeiro) | `admin` | `admin` or `supervisor` | 🚧 In progress | `/admin/*` |
| 3 | **Gerente de Vendas** (Vendas + Equipe) | `supersaler` | any | 🚧 In progress | `/saler/*` |
| 4 | **Vendedor** | `saler` | any | 🚧 In progress | `/saler/*` |
| 5 | **Comprador** (Pedidos de Compra) | `buyer` | any | 🔜 Planned | `/buyer/*` |
| 6 | **Estoque** (Operações de Estoque) | `inventory` | any | 🔜 Planned | `/inventory/*` (future) |

**Currently implemented (partial):** actors 2, 3, and 4.

### Route → Actor mapping (current)

- `/saler/orders` — Lançamento de Pedidos → actors 3, 4
- `/saler/orders-history` — Histórico de Pedidos → actors 3, 4
- `/saler/price-table` — Tabela de Preços → actors 3, 4
- `/saler/performance` — Analisar desempenho → actors 3, 4
- `/saler/customers` — Lista de Clientes → actor 3
- `/saler/team` — Configurar Equipe → actor 3
- `/admin/graph` — Dashboard com Gráficos → actor 2
- `/admin/grid` — Pesquisas em Grid → actor 2
- `/buyer/edit` — Dados do Comprador → actor 5
- `/buyer/orders` — Pedido de Compra → actor 5
- `/buyer/orders-history` — Histórico de Pedidos (compra) → actor 5

## Architecture

### Two route groups under `src/app/`

- **`(site)/`** — public routes: `auth/{login,lost-password,reset-password}`, `privacy-policy`, `terms-of-service`, `user-pre`. Has its own [layout.tsx](src/app/(site)/layout.tsx).
- **`(dash)/`** — authenticated routes wrapped by [src/app/(dash)/layout.tsx](src/app/(dash)/layout.tsx) (`HeaderPrivate` + `Footer`). Subdivided by role:
  - `home/` — landing after login; also where instance selection happens when `session.instanceName` is missing.
  - `admin/` — admin role only: management dashboards (graph, grid) — actor 2.
  - `saler/` — saler + supersaler roles: sales operations (orders, orders-history, performance, price-table) plus customers/team for supersaler — actors 3 and 4.
  - `buyer/` — buyer role only: purchase orders (edit, orders, orders-history) — actor 5.
  - `inventory/` *(future)* — inventory role only: stock operations — actor 6.

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

[src/middleware.ts](src/middleware.ts) runs on every non-static path **except Server Action POSTs** (requests with `next-action` header are excluded from the matcher — redirecting a Server Action POST breaks Next.js's action reducer). Estrutura interna: pipeline tipado de `Handler[]` (cada handler retorna `NextResponse | null`) — adicione handlers em ordem explícita, não inflar `middleware()`.
- **Verifica o JWT localmente** com `verifyAccessToken` ([src/lib/auth/edge-safe.ts](src/lib/auth/edge-safe.ts)) — sem round-trip a `/backend/session`. Se expirado e houver refresh token, tenta `POST /auth/refresh` inline e re-emite cookies via `pendingCookies` no ctx.
- Public-vs-protected é decidido contra `PUBLIC_ROUTES` / `PROTECTED_ROUTES` em [src/config/route-registry.ts](src/config/route-registry.ts) — **edite esse arquivo quando adicionar uma rota nova; o menu do dashboard e o middleware derivam dele automaticamente.**
- `/home` é especial: acessível a qualquer usuário autenticado mesmo sem tenant; demais rotas `(dash)` exigem `session.instanceName` e redirecionam a `/home` se ausente.
- Role gating verifica se **alguma** role em `session.roleFront` (array) pertence às roles do prefixo casado — ver `hasRequiredRole` em [src/lib/auth/edge-safe.ts](src/lib/auth/edge-safe.ts). Roles ativas: `admin`, `supersaler`, `saler`, `buyer`, `inventory`, `notallow` (`ROLES` em [src/types/role.ts](src/types/role.ts)). Note: `supersaler` (gerente de vendas) substituiu o legado `supervisor` para seguir o novo padrão da API — o `supervisor` antigo cobria administrativo e gerente de vendas, agora divididos em `admin` e `supersaler`.

`edge-safe.ts` é a fonte única para `verifyAccessToken`, `refreshAccessToken`, `hasRequiredRole`, `COOKIE_MAX_AGES` e `COOKIE_OPTIONS` — importável tanto pelo middleware (Edge runtime) quanto por server actions Node. Não duplique essas funções em outros arquivos.

Server Actions handle token refresh independently via `fetchWithAuth` (see [src/lib/api-client.ts](src/lib/api-client.ts)).

## Project conventions

- **Mobile First — Portrait priority.** The app runs on phones in portrait mode. Every page and component must work at ≥360px wide first. Use `sm:` breakpoints only as progressive enhancement. Test all new UI at 360×780px before larger screens. Never use `truncate` to hide content that the user needs — reflow the layout instead.
- **All UI copy is Portuguese (pt-BR).** CTAs use imperative verbs ("Salvar", "Lançar Pedido"). Error messages describe the corrective action, not the HTTP code.
- **Design tokens only** — never inline hex values; use `var(--primary)`, `var(--card)`, etc. from [src/app/globals.css](src/app/globals.css). All components must work under `.dark`.
- **Icons:** Lucide React only (`size={20}` default, `size={16}` inline).
- **shadcn primitives in [src/components/ui/](src/components/ui/) are generated — do not hand-edit.** Build new components in sibling folders (`header/`, `footer/`, `home/`) that compose them.
- **Server Actions for backend calls** — service files in [src/lib/](src/lib/) start with `"use server"` and are the only place cookies are mutated. Don't fetch the backend directly from client components; go through a hook. All authenticated calls must use `fetchWithAuth` from [src/lib/api-client.ts](src/lib/api-client.ts) — it handles token refresh + cookie rotation automatically. Never roll `getAuthTokens()` + manual `fetch(..., { headers: { Authorization } })` in new actions; that pattern is gone.
- Module names shown in the dashboard come from [src/config/route-registry.ts](src/config/route-registry.ts) (campo `menu.label`) — match those strings exactly when referencing them in copy.

Full design contract for AI-generated UI: [agent_docs/design-rules.md](agent_docs/design-rules.md). Brand reference: [BRAND.md](BRAND.md).

## Code quality requirements (SOLID + Clean Code)

Estes são **requisitos do projeto**, não recomendações. Toda nova contribuição (humana ou IA) deve aderir; PRs que violem precisam de justificativa explícita.

### Tamanho e responsabilidade

- **SRP por arquivo:** uma página, um hook ou um componente faz **uma** coisa. Se você precisa explicar um arquivo com "e", "também" ou "além disso", quebre.
- **Limites de tamanho** (não absolutos, mas pontos de alerta):
  - Page (`page.tsx`): ≤250 linhas. Acima disso, extraia blocos para `components/<feature>/`.
  - Hook: ≤150 linhas. Acima disso, decomponha em sub-hooks compostos por um orquestrador fino.
  - Componente: ≤200 linhas. Acima disso, separe presentational vs container, ou extraia subcomponentes.
- **ISP em hooks:** hook que retorna >10 valores é cheiro de "hook deus". Quebre em hooks focados que o componente compõe.

### DRY e reuso

- **Padrões repetidos viram primitivos:** loading/error states, form fields, page containers, listagens responsivas. Antes de copiar JSX/Tailwind pela 3ª vez, extraia para `components/<dominio>/` ou `components/ui/<primitive>/`.
- **Classes Tailwind repetidas** (>5 ocorrências do mesmo conjunto) viram componente, não snippet copiado.
- **Validadores compartilhados** (CPF, CNPJ, telefone, CEP) ficam em [src/lib/validation/](src/lib/validation/) — não reescreva.

### Tipos e schemas

- **Zod como source-of-truth** para tipos de payload: prefira `z.infer<typeof Schema>` em vez de definir o tipo TS e o schema em paralelo (drift garantido).
- **Erros tipados:** `ActionResult<T>` é a forma canônica (ver [src/lib/api-action.ts](src/lib/api-action.ts)). Não invente outras shapes.
- **Sem `any`** em código de aplicação. `unknown` é aceito em fronteiras (logger, parsers).

### Tratamento de erro

- **Toast para feedback transitório**, `Callout` para estado persistente da página, `ErrorBoundary` para crash recovery. Não use `Callout` inline para todo erro — vira ruído.
- **Logger estruturado** via [src/lib/observability/log.ts](src/lib/observability/log.ts) (`logError`/`logWarn`/`logInfo`). Não use `console.*` direto em código server-side.
- **Erros silenciosos** (`catch { return null }`) são proibidos — sempre logar com scope.

### Acoplamento

- **DIP em hooks:** hooks consomem services agrupados (`customerApi.search()`), não importam 7 server actions soltas. Quando uma feature tem ≥3 actions relacionadas, agrupe num objeto exportado.
- **OCP em rotas:** adicionar rota nova é **uma** entrada em [src/config/route-registry.ts](src/config/route-registry.ts). Não toque middleware.

### Camadas

- **`src/components/ui/`:** primitivos shadcn (gerados — não editar à mão).
- **`src/components/<dominio>/`:** componentes da aplicação que compõem primitivos.
- **`src/hooks/`:** estado + side effects. Sem JSX.
- **`src/lib/<dominio>/`:** server actions + utilitários puros. Server actions começam com `"use server"` e usam `fetchWithAuth`/`createAction`.
- **`src/config/`:** configuração viva (rotas, menus, feature flags).
- **`src/types/`:** tipos compartilhados. Tipos de domínio derivados de Zod ficam junto do schema.

Histórico da refatoração inicial que estabilizou esses requisitos: [agent_docs/refactor-solid-clean-code.md](agent_docs/refactor-solid-clean-code.md). Inclui a lista de arquivos ainda acima dos limites como débito conhecido — abordá-los quando a próxima mudança grande tocar a área.
