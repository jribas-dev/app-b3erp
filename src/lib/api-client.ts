import { cookies } from "next/headers";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
};
const ACCESS_TOKEN_MAX_AGE = 3 * 60 * 60;
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60;

export async function fetchWithAuth(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const apiUrl = process.env.BACKEND_URL;
  if (!apiUrl) throw new Error("URL da API não configurada");

  const store = await cookies();
  let accessToken = store.get("accessToken")?.value;
  const refreshToken = store.get("refreshToken")?.value;

  const buildHeaders = (token?: string) => {
    const h = new Headers(init.headers);
    if (!h.has("Content-Type")) h.set("Content-Type", "application/json");
    if (token) h.set("Authorization", `Bearer ${token}`);
    return h;
  };

  const response = await fetch(`${apiUrl}${path}`, {
    ...init,
    headers: buildHeaders(accessToken),
  });

  if (response.status !== 401 || !refreshToken) return response;

  // Antes de tentar refresh, re-ler cookies — se action paralela já renovou,
  // outra request da mesma página pode ter atualizado o cookie do request store.
  const latest = store.get("accessToken")?.value;
  if (latest && latest !== accessToken) {
    accessToken = latest;
    return await fetch(`${apiUrl}${path}`, {
      ...init,
      headers: buildHeaders(accessToken),
    });
  }

  const refreshResp = await fetch(`${apiUrl}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!refreshResp.ok) return response;

  const tokens = await refreshResp.json();
  store.set("accessToken", tokens.accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });
  if (tokens.refreshToken) {
    store.set("refreshToken", tokens.refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: REFRESH_TOKEN_MAX_AGE,
    });
  }

  return await fetch(`${apiUrl}${path}`, {
    ...init,
    headers: buildHeaders(tokens.accessToken),
  });
}
