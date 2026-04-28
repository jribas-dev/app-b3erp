import { getAuthTokens, setAuthCookies } from "./auth/cookies";

function resolveApiUrl(): string {
  const apiUrl = process.env.BACKEND_URL;
  if (!apiUrl) throw new Error("URL da API não configurada");
  return apiUrl;
}

function buildHeaders(init: RequestInit, token?: string): Headers {
  const h = new Headers(init.headers);
  if (!h.has("Content-Type")) h.set("Content-Type", "application/json");
  if (token) h.set("Authorization", `Bearer ${token}`);
  return h;
}

export async function fetchPublic(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const apiUrl = resolveApiUrl();
  return fetch(`${apiUrl}${path}`, {
    ...init,
    headers: buildHeaders(init),
  });
}

type RefreshResp = { accessToken: string; refreshToken?: string };

// Dedup por processo: quando N server actions paralelas batem 401 com o mesmo
// refresh token, apenas UMA chamada /auth/refresh sai. As demais aguardam a
// mesma promise e reusam os tokens rotacionados — eliminando a race em que a
// perdedora invalida a sessão. O Map é keyed pelo próprio refreshToken (cada
// usuário tem o seu, então não há contaminação cruzada).
//
// Limitação: dedup vale dentro de um Node.js process. Em deploys com múltiplas
// instâncias balanceadas, requests podem cair em processos diferentes — mesmo
// problema que existia antes, sem regressão.
const inflightRefresh = new Map<string, Promise<RefreshResp | null>>();

async function refreshTokenSingleton(
  refreshToken: string,
): Promise<RefreshResp | null> {
  const existing = inflightRefresh.get(refreshToken);
  if (existing) return existing;

  const promise = (async () => {
    try {
      const resp = await fetchPublic("/auth/refresh", {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
      });
      if (!resp.ok) return null;
      return (await resp.json()) as RefreshResp;
    } finally {
      inflightRefresh.delete(refreshToken);
    }
  })();
  inflightRefresh.set(refreshToken, promise);
  return promise;
}

export async function fetchWithAuth(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const apiUrl = resolveApiUrl();
  const { accessToken, refreshToken } = await getAuthTokens();

  const response = await fetch(`${apiUrl}${path}`, {
    ...init,
    headers: buildHeaders(init, accessToken),
  });

  if (response.status !== 401 || !refreshToken) return response;

  const tokens = await refreshTokenSingleton(refreshToken);
  if (!tokens) return response;

  // Mantém a janela longa (3h) do access token mesmo quando o backend não
  // rotaciona o refresh: setAuthCookies escolhe 15min vs 3h pela presença do
  // refreshToken, então repassamos o existente quando o novo não vem.
  await setAuthCookies(tokens.accessToken, tokens.refreshToken ?? refreshToken);

  return await fetch(`${apiUrl}${path}`, {
    ...init,
    headers: buildHeaders(init, tokens.accessToken),
  });
}
