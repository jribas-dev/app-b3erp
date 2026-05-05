"use server";

import { redirect } from "next/navigation";

import { type AuthResponse } from "@/types/auth-response";
import { type SessionData } from "@/types/session-data";
import {
  UserInstanceList,
  UserInstanceListResponse,
} from "@/types/user-instance-list";

import { fetchPublic, fetchWithAuth } from "./api-client";
import {
  clearAuthCookies,
  clearSelectedEmitenteCookie,
  getAuthTokens,
  setAuthCookies,
} from "./auth/cookies";
import { refreshAccessToken, verifyAccessToken } from "./auth/edge-safe";
import { logError } from "./observability/log";
import { SignInFormData } from "./forms/sign-in.form";

export async function loginAction(
  credentials: SignInFormData,
  rememberMe: boolean = false
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetchPublic("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return { success: false, error: error.message || "Erro ao fazer login" };
    }

    const data: AuthResponse = await response.json();
    await setAuthCookies(data.accessToken, undefined, rememberMe);
    return { success: true };
  } catch (error) {
    logError("login", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Erro interno do servidor",
    };
  }
}

export async function selectInstanceAction(
  dbId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { accessToken, rememberMe } = await getAuthTokens();
    if (!accessToken) {
      return { success: false, error: "Token de acesso não encontrado" };
    }

    const response = await fetchWithAuth("/auth/instance", {
      method: "POST",
      body: JSON.stringify({ dbId }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return {
        success: false,
        error: error.message || "Erro ao selecionar instância",
      };
    }

    const data: AuthResponse = await response.json();
    await setAuthCookies(data.accessToken, data.refreshToken, rememberMe);
    await clearSelectedEmitenteCookie();
    return { success: true };
  } catch (error) {
    logError("selectInstance", error, { dbId });
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Erro interno do servidor",
    };
  }
}

// Decodifica o JWT localmente (sem round-trip ao backend). Se o access token
// estiver expirado mas houver refresh válido, tenta renovar e re-verifica.
export async function getSessionAction(): Promise<SessionData | null> {
  try {
    const { accessToken } = await getAuthTokens();
    if (!accessToken) return null;

    const result = await verifyAccessToken(accessToken);
    if (result.kind === "valid") return result.session;
    if (result.kind !== "expired") return null;

    const refreshed = await refreshTokenAction();
    if (!refreshed.success) return null;

    const { accessToken: newToken } = await getAuthTokens();
    if (!newToken) return null;

    const reverify = await verifyAccessToken(newToken);
    return reverify.kind === "valid" ? reverify.session : null;
  } catch (error) {
    logError("getSession", error);
    return null;
  }
}

export async function refreshTokenAction(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const { refreshToken } = await getAuthTokens();
    if (!refreshToken) {
      return { success: false, error: "Refresh token não encontrado" };
    }

    const data = await refreshAccessToken(refreshToken);
    if (!data) return { success: false, error: "Erro ao renovar token" };

    await setAuthCookies(data.accessToken, data.refreshToken);
    return { success: true };
  } catch (error) {
    logError("refreshToken", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Erro interno do servidor",
    };
  }
}

export async function logoutAction(): Promise<void> {
  try {
    const { accessToken } = await getAuthTokens();
    if (accessToken) {
      await fetchWithAuth("/auth/logout", { method: "POST" });
    }
  } catch (error) {
    logError("logout", error);
  } finally {
    await clearAuthCookies();
  }
}

export async function getUserInstancesAction(
  userId: string
): Promise<UserInstanceListResponse> {
  try {
    const response = await fetchWithAuth(`/user-instances/user/${userId}`, {
      method: "GET",
      cache: "no-store",
    });

    if (response.status === 404) {
      return { success: true, data: [] };
    }

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || "Erro ao buscar instâncias do usuário",
      };
    }

    const data: UserInstanceList[] = await response.json();
    return { success: true, data };
  } catch (error) {
    logError("getUserInstances", error, { userId });
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Erro interno do servidor",
    };
  }
}

export async function redirectAfterLogin() {
  redirect("/home");
}

export async function redirectToLogin() {
  redirect("/auth/login");
}
