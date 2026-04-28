import { cookies } from "next/headers";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
};

const ACCESS_TOKEN_FIRST_MAX_AGE = 15 * 60;
const ACCESS_TOKEN_SECOND_MAX_AGE = 3 * 60 * 60;
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60;

export async function setAuthCookies(
  accessToken: string,
  refreshToken?: string,
  rememberMe?: boolean,
): Promise<void> {
  const store = await cookies();
  const accessTokenMaxAge = refreshToken
    ? ACCESS_TOKEN_SECOND_MAX_AGE
    : ACCESS_TOKEN_FIRST_MAX_AGE;

  store.set("accessToken", accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: accessTokenMaxAge,
  });

  if (refreshToken) {
    store.set("refreshToken", refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: REFRESH_TOKEN_MAX_AGE,
    });
  }

  if (rememberMe !== undefined) {
    store.set("rememberMe", rememberMe ? "true" : "false", {
      ...COOKIE_OPTIONS,
      maxAge: rememberMe ? REFRESH_TOKEN_MAX_AGE : 0,
    });
  }
}

export async function clearAuthCookies(): Promise<void> {
  const store = await cookies();
  store.delete("accessToken");
  store.delete("refreshToken");
  store.delete("rememberMe");
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
