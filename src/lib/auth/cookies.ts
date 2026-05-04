import { cookies } from "next/headers";

import { COOKIE_MAX_AGES, COOKIE_OPTIONS } from "./edge-safe";

const SELECTED_EMITENTE_COOKIE = "selectedEmitente";

export async function setAuthCookies(
  accessToken: string,
  refreshToken?: string,
  rememberMe?: boolean,
): Promise<void> {
  const store = await cookies();
  const accessTokenMaxAge = refreshToken
    ? COOKIE_MAX_AGES.ACCESS_SECOND
    : COOKIE_MAX_AGES.ACCESS_FIRST;

  store.set("accessToken", accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: accessTokenMaxAge,
  });

  if (refreshToken) {
    store.set("refreshToken", refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: COOKIE_MAX_AGES.REFRESH,
    });
  }

  if (rememberMe !== undefined) {
    store.set("rememberMe", rememberMe ? "true" : "false", {
      ...COOKIE_OPTIONS,
      maxAge: rememberMe ? COOKIE_MAX_AGES.REFRESH : 0,
    });
  }
}

export async function clearAuthCookies(): Promise<void> {
  const store = await cookies();
  store.delete("accessToken");
  store.delete("refreshToken");
  store.delete("rememberMe");
  store.delete(SELECTED_EMITENTE_COOKIE);
}

export async function setSelectedEmitenteCookie(idemp: number): Promise<void> {
  const store = await cookies();
  store.set(SELECTED_EMITENTE_COOKIE, String(idemp), {
    ...COOKIE_OPTIONS,
    maxAge: COOKIE_MAX_AGES.REFRESH,
  });
}

export async function getSelectedEmitenteCookie(): Promise<number | null> {
  const store = await cookies();
  const raw = store.get(SELECTED_EMITENTE_COOKIE)?.value;
  if (!raw) return null;
  const parsed = Number(raw);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

export async function clearSelectedEmitenteCookie(): Promise<void> {
  const store = await cookies();
  store.delete(SELECTED_EMITENTE_COOKIE);
}

export async function getAuthTokens(): Promise<{
  accessToken: string | undefined;
  refreshToken: string | undefined;
  rememberMe: boolean;
}> {
  const store = await cookies();
  return {
    accessToken: store.get("accessToken")?.value,
    refreshToken: store.get("refreshToken")?.value,
    rememberMe: store.get("rememberMe")?.value === "true",
  };
}
