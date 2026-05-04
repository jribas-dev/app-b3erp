import { NextResponse, type NextRequest } from "next/server";

import {
  COOKIE_MAX_AGES,
  COOKIE_OPTIONS,
  hasRequiredRole,
  refreshAccessToken,
  verifyAccessToken,
} from "@/lib/auth/edge-safe";
import { logError } from "@/lib/observability/log";
import { PROTECTED_ROUTES, PUBLIC_ROUTES } from "@/config/route-registry";
import type { SessionData } from "@/types/session-data";

type PendingCookies = { accessToken: string; refreshToken?: string };

type MiddlewareCtx = {
  request: NextRequest;
  pathname: string;
  accessToken: string | undefined;
  refreshToken: string | undefined;
  rememberMe: boolean;
  session: SessionData | null;
  pendingCookies: PendingCookies | null;
};

type Handler = (ctx: MiddlewareCtx) => Promise<NextResponse | null>;

function setAuthCookiesOnResponse(
  response: NextResponse,
  pending: PendingCookies,
): NextResponse {
  // Igual à regra de cookies.ts: presença de refreshToken indica sessão pós
  // /auth/instance, então o accessToken pode usar a janela longa (3h).
  const accessMaxAge = pending.refreshToken
    ? COOKIE_MAX_AGES.ACCESS_SECOND
    : COOKIE_MAX_AGES.ACCESS_FIRST;

  response.cookies.set("accessToken", pending.accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: accessMaxAge,
  });

  if (pending.refreshToken) {
    response.cookies.set("refreshToken", pending.refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: COOKIE_MAX_AGES.REFRESH,
    });
  }

  return response;
}

function isPublicRoute(pathname: string): boolean {
  return (
    pathname === "/" ||
    PUBLIC_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
    )
  );
}

// Resolve a sessão a partir do accessToken atual; se expirado e houver
// refreshToken, tenta o refresh inline e armazena os novos cookies em
// `pendingCookies` para que o handler final propague na resposta.
async function resolveSession(ctx: MiddlewareCtx): Promise<void> {
  if (!ctx.accessToken) return;

  const result = await verifyAccessToken(ctx.accessToken);

  if (result.kind === "valid") {
    ctx.session = result.session;
    return;
  }

  if (result.kind === "misconfigured") {
    logError("middleware.verifyAccessToken", new Error("JWT_SECRET ausente"), {
      pathname: ctx.pathname,
    });
    return;
  }

  if (result.kind === "expired" && ctx.refreshToken) {
    const refreshed = await refreshAccessToken(ctx.refreshToken);
    if (!refreshed) return;

    const reverify = await verifyAccessToken(refreshed.accessToken);
    if (reverify.kind !== "valid") return;

    ctx.session = reverify.session;
    ctx.pendingCookies = {
      accessToken: refreshed.accessToken,
      refreshToken: refreshed.refreshToken,
    };
  }
}

// Handlers — cada um retorna NextResponse para terminar o pipeline ou null
// para passar adiante. Ordem é significativa.

const redirectLoggedFromLogin: Handler = async (ctx) => {
  if (ctx.pathname !== "/auth/login") return null;
  if (!ctx.accessToken || !ctx.rememberMe) return null;

  await resolveSession(ctx);
  if (!ctx.session) return null;

  const response = NextResponse.redirect(new URL("/home", ctx.request.url));
  return ctx.pendingCookies
    ? setAuthCookiesOnResponse(response, ctx.pendingCookies)
    : response;
};

const allowPublic: Handler = async (ctx) => {
  return isPublicRoute(ctx.pathname) ? NextResponse.next() : null;
};

const requireAccessToken: Handler = async (ctx) => {
  if (ctx.accessToken) return null;
  const loginUrl = new URL("/auth/login", ctx.request.url);
  loginUrl.searchParams.set("redirect", ctx.pathname);
  return NextResponse.redirect(loginUrl);
};

const validateOrRefresh: Handler = async (ctx) => {
  await resolveSession(ctx);
  return null;
};

const requireSessionOrRedirect: Handler = async (ctx) => {
  if (ctx.session) return null;
  // Não limpamos cookies aqui: o refresh-token é uso único com rotação
  // automática, e múltiplas server actions em paralelo (Promise.all) disputam
  // o mesmo refresh. Apagar cookies na requisição perdedora destrói a sessão
  // que a vencedora já renovou. O logout explícito (logoutAction) continua
  // limpando cookies no auth.service.
  return NextResponse.redirect(new URL("/auth/login", ctx.request.url));
};

const requireInstance: Handler = async (ctx) => {
  if (!ctx.session) return null;
  if (ctx.session.instanceName) return null;

  // /home pode ser acessado sem instância (é onde o usuário escolhe).
  if (ctx.pathname === "/home") return null;
  // Sub-rotas de /home e demais rotas privadas exigem instância.
  return NextResponse.redirect(new URL("/home", ctx.request.url));
};

const gateByRole: Handler = async (ctx) => {
  if (!ctx.session) return null;

  const protectedRoute = Object.keys(PROTECTED_ROUTES).find(
    (route) =>
      route !== "/home" &&
      (ctx.pathname === route || ctx.pathname.startsWith(`${route}/`)),
  ) as keyof typeof PROTECTED_ROUTES | undefined;

  if (!protectedRoute) return null;

  const requiredRoles = PROTECTED_ROUTES[protectedRoute];
  if (hasRequiredRole(ctx.session.roleFront, requiredRoles)) return null;

  return NextResponse.redirect(new URL("/home", ctx.request.url));
};

const pipeline: Handler[] = [
  redirectLoggedFromLogin,
  allowPublic,
  requireAccessToken,
  validateOrRefresh,
  requireSessionOrRedirect,
  requireInstance,
  gateByRole,
];

export async function middleware(request: NextRequest) {
  const ctx: MiddlewareCtx = {
    request,
    pathname: request.nextUrl.pathname,
    accessToken: request.cookies.get("accessToken")?.value,
    refreshToken: request.cookies.get("refreshToken")?.value,
    rememberMe: request.cookies.get("rememberMe")?.value === "true",
    session: null,
    pendingCookies: null,
  };

  for (const handler of pipeline) {
    const result = await handler(ctx);
    if (result) {
      return ctx.pendingCookies
        ? setAuthCookiesOnResponse(result, ctx.pendingCookies)
        : result;
    }
  }

  const response = NextResponse.next();
  return ctx.pendingCookies
    ? setAuthCookiesOnResponse(response, ctx.pendingCookies)
    : response;
}

export const config = {
  matcher: [
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
      missing: [{ type: "header", key: "next-action" }],
    },
  ],
};
