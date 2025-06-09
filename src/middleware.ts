import { NextResponse, NextRequest } from "next/server";
import { PROTECTED_ROUTES, PUBLIC_ROUTES } from "./mocks/routes-permission";
import { SessionData } from "./types/session-data";
import { AuthResponse } from "./types/auth-response";

async function getSession(accessToken: string): Promise<SessionData | null> {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/backend/session`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao verificar sessão:", error);
    return null;
  }
}

async function refreshAccessToken(
  refreshToken: string
): Promise<AuthResponse | null> {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao renovar token:", error);
    return null;
  }
}

function setSecureCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken?: string
) {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
  };

  // Access Token com tempo menor (conforme JWT exp)
  response.cookies.set("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 3 * 60 * 60, // 3 horas em segundos
  });

  // Refresh Token com tempo maior (se fornecido)
  if (refreshToken) {
    response.cookies.set("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60, // 7 dias em segundos
    });
  }
}

function clearAuthCookies(response: NextResponse) {
  response.cookies.delete("accessToken");
  response.cookies.delete("refreshToken");
  response.cookies.delete("rememberMe");
}

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(
    (route) =>
      pathname === "/" || pathname === route || pathname.startsWith(`${route}/`)
  );
}

function hasRequiredRole(
  userRole: string | undefined,
  requiredRoles: readonly string[]
): boolean {
  if (!userRole || requiredRoles.length === 0) return true;
  return requiredRoles.includes(userRole);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log("MIDDLEWARE:", pathname);

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const rememberMe = request.cookies.get("rememberMe")?.value === "true";

  // Verificar se usuário já está autenticado e está tentando acessar página de login
  if (pathname === "/auth/login" && accessToken && rememberMe) {
    // Verificar se a sessão ainda é válida
    let session = await getSession(accessToken);

    // Se a sessão não é válida mas há refresh token, tentar renovar
    if (!session && refreshToken) {
      const refreshResult = await refreshAccessToken(refreshToken);
      if (refreshResult) {
        session = await getSession(refreshResult.accessToken);
        if (session) {
          // Redirecionar para home com novos tokens
          const response = NextResponse.redirect(new URL("/home", request.url));
          setSecureCookies(
            response,
            refreshResult.accessToken,
            refreshResult.refreshToken
          );
          return response;
        }
      }
    }

    // Se a sessão é válida, redirecionar para home
    if (session) {
      return NextResponse.redirect(new URL("/home", request.url));
    }
  }

  // Permitir rotas públicas
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Se não há token de acesso, redirecionar para login
  if (!accessToken) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verificar sessão atual
  let session = await getSession(accessToken);

  // Se sessão inválida, tentar renovar com refresh token
  if (!session && refreshToken) {
    const refreshResult = await refreshAccessToken(refreshToken);

    if (refreshResult) {
      // Verificar nova sessão com token renovado
      session = await getSession(refreshResult.accessToken);

      if (session) {
        // Criar resposta com novos cookies
        const response = NextResponse.next();
        setSecureCookies(
          response,
          refreshResult.accessToken,
          refreshResult.refreshToken
        );
        return response;
      }
    }
  }

  // Se ainda não há sessão válida, limpar cookies e redirecionar
  if (!session) {
    const response = NextResponse.redirect(new URL("/auth/login", request.url));
    clearAuthCookies(response);
    return response;
  }

  // Verificar se é rota /home e se usuário precisa escolher instância
  if (pathname.startsWith("/home") && !session.instanceName) {
    // Usuário autenticado mas sem instância selecionada - permitir acesso ao /home
    if (pathname === "/home") {
      return NextResponse.next();
    }
    // Bloquear sub-rotas de /home sem instância
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // Verificar rotas protegidas que não sejam /home
  const protectedRoute = Object.keys(PROTECTED_ROUTES).find(
    (route) => pathname.startsWith(route) && route !== "/home"
  ) as keyof typeof PROTECTED_ROUTES;

  if (protectedRoute) {
    // Para rotas além de /home, exigir instância selecionada
    if (!session.instanceName) {
      return NextResponse.redirect(new URL("/home", request.url));
    }

    const requiredRoles = PROTECTED_ROUTES[protectedRoute];

    if (!hasRequiredRole(session.roleFront, requiredRoles)) {
      // Usuário não tem permissão - redirecionar para home
      return NextResponse.redirect(new URL("/home", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
