import { jwtVerify, errors as joseErrors, type JWTPayload } from "jose";
import type { AuthResponse } from "@/types/auth-response";
import type { SessionData } from "@/types/session-data";

// Fonte única para verificação de JWT, refresh, role check e config de cookie.
// Este módulo NÃO usa "use server" nem next/headers — é importável tanto pelo
// middleware (Edge runtime) quanto por server actions (Node runtime).

export type SessionResult =
  | { kind: "valid"; session: SessionData }
  | { kind: "expired" }
  | { kind: "invalid" }
  | { kind: "misconfigured" };

const SECONDS = {
  MIN: 60,
  HOUR: 60 * 60,
  DAY: 24 * 60 * 60,
} as const;

export const COOKIE_MAX_AGES = {
  ACCESS_FIRST: 15 * SECONDS.MIN,
  ACCESS_SECOND: 3 * SECONDS.HOUR,
  REFRESH: 7 * SECONDS.DAY,
} as const;

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
};

let cachedSecret: Uint8Array | null = null;
function resolveSecret(): Uint8Array | null {
  if (cachedSecret) return cachedSecret;
  const raw = process.env.JWT_SECRET;
  if (!raw) return null;
  cachedSecret = new TextEncoder().encode(raw);
  return cachedSecret;
}

export async function verifyAccessToken(token: string): Promise<SessionResult> {
  const secret = resolveSecret();
  if (!secret) return { kind: "misconfigured" };
  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });
    const session = payloadToSession(payload);
    return session ? { kind: "valid", session } : { kind: "invalid" };
  } catch (err) {
    if (err instanceof joseErrors.JWTExpired) return { kind: "expired" };
    return { kind: "invalid" };
  }
}

function payloadToSession(p: JWTPayload): SessionData | null {
  const sub = typeof p.sub === "string" ? p.sub : null;
  const email = typeof p.email === "string" ? p.email : null;
  if (!sub || !email) return null;
  return {
    userId: sub,
    email,
    isRoot: Boolean(p.isRoot),
    dbId: typeof p.dbId === "string" ? p.dbId : undefined,
    instanceName:
      typeof p.instanceName === "string" ? p.instanceName : undefined,
    roleBack: typeof p.roleBack === "string" ? p.roleBack : undefined,
    roleFront: Array.isArray(p.roleFront)
      ? p.roleFront.filter((r): r is string => typeof r === "string")
      : undefined,
  };
}

export async function refreshAccessToken(
  refreshToken: string,
): Promise<AuthResponse | null> {
  const apiUrl = process.env.BACKEND_URL;
  if (!apiUrl) return null;
  try {
    const response = await fetch(`${apiUrl}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!response.ok) return null;
    return (await response.json()) as AuthResponse;
  } catch {
    return null;
  }
}

export function hasRequiredRole(
  userRoles: string[] | undefined,
  requiredRoles: readonly string[],
): boolean {
  if (requiredRoles.length === 0) return true;
  if (!userRoles || userRoles.length === 0) return false;
  return userRoles.some((role) => requiredRoles.includes(role));
}
