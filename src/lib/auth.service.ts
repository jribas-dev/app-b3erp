"use server";

import { SignInFormData } from "./validations/sign-in.form";
import { type AuthResponse } from "@/types/auth-response";
import { type SessionData } from "@/types/session-data";
import { UserInstanceList, UserInstanceListResponse } from "@/types/user-instance-list";
import { redirect } from "next/navigation";
import { fetchPublic, fetchWithAuth } from "./api-client";
import {
  clearAuthCookies,
  getAuthTokens,
  setAuthCookies,
} from "./auth/cookies";
import { logError } from "./observability/log";

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

export async function getSessionAction(): Promise<SessionData | null> {
  try {
    const response = await fetchWithAuth("/backend/session", {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
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

    const response = await fetchPublic("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      return { success: false, error: "Erro ao renovar token" };
    }

    const data: AuthResponse = await response.json();
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

export async function hasPermission(
  userRole: string | undefined,
  requiredRoles: string[]
): Promise<boolean> {
  if (!userRole || requiredRoles.length === 0) return true;
  return requiredRoles.includes(userRole);
}
