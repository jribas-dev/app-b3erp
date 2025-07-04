"use server";

import { SignInFormData } from "./validations/sign-in.form";
import { type AuthResponse } from "@/types/auth-response";
import { type SessionData } from "@/types/session-data";
import { UserInstanceList, UserInstanceListResponse } from "@/types/user-instance-list";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Configurações de cookies seguros
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
};

const ACCESS_TOKEN_FIRST_MAX_AGE = 15 * 60; // 15 minutos
const ACCESS_TOKEN_SECOND_MAX_AGE = 3 * 60 * 60; // 3 horas
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60; // 7 dias

async function setAuthCookies(
  accessToken: string,
  refreshToken?: string,
  rememberMe: boolean = false
) {
  const cookieStore = await cookies();
  const accessTokenMaxAge = refreshToken
    ? ACCESS_TOKEN_SECOND_MAX_AGE
    : ACCESS_TOKEN_FIRST_MAX_AGE;

  cookieStore.set("accessToken", accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: accessTokenMaxAge,
  });

  if (refreshToken) {
    cookieStore.set("refreshToken", refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: REFRESH_TOKEN_MAX_AGE,
    });
  }
  
  cookieStore.set("rememberMe", rememberMe ? "true" : "false", {
    ...COOKIE_OPTIONS,
    maxAge: rememberMe ? REFRESH_TOKEN_MAX_AGE : 0,
  });
}

async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
  cookieStore.delete("rememberMe");
}

async function getAuthTokens() {
  const cookieStore = await cookies();
  return {
    accessToken: cookieStore.get("accessToken")?.value,
    refreshToken: cookieStore.get("refreshToken")?.value,
    rememberMe: cookieStore.get("rememberMe")?.value === "true",
  };
}

export async function loginAction(
  credentials: SignInFormData,
  rememberMe: boolean = false
): Promise<{ success: boolean; error?: string }> {
  try {
    const apiUrl = process.env.BACKEND_URL;
    if (!apiUrl) {
      throw new Error("URL da API não configurada");
    }

    const response = await fetch(`${apiUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Erro ao fazer login" };
    }

    const data: AuthResponse = await response.json();
    await setAuthCookies(data.accessToken, undefined, rememberMe);
    return { success: true };
  } catch (error) {
    console.error("Erro no login:", error);
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
    const apiUrl = process.env.BACKEND_URL;
    if (!apiUrl) {
      throw new Error("URL da API não configurada");
    }

    const { accessToken, rememberMe } = await getAuthTokens();
    if (!accessToken) {
      return { success: false, error: "Token de acesso não encontrado" };
    }

    const response = await fetch(`${apiUrl}/auth/instance`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ dbId }),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || "Erro ao selecionar instância",
      };
    }

    const data: AuthResponse = await response.json();
    await setAuthCookies(data.accessToken, data.refreshToken, rememberMe);

    // Retorna sucesso e deixa o componente gerenciar a atualização da UI
    return { success: true };
  } catch (error) {
    console.error("Erro na seleção de instância:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Erro interno do servidor",
    };
  }
}

export async function getSessionAction(): Promise<SessionData | null> {
  try {
    const apiUrl = process.env.BACKEND_URL;
    if (!apiUrl) {
      console.error("URL da API não configurada");
      return null;
    }

    const { accessToken } = await getAuthTokens();
    if (!accessToken) {
      return null;
    }

    const response = await fetch(`${apiUrl}/backend/session`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store", // Evita cache para sempre pegar dados atualizados
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("Erro ao obter sessão:", error);
    return null;
  }
}

export async function refreshTokenAction(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const apiUrl = process.env.BACKEND_URL;
    if (!apiUrl) {
      return { success: false, error: "URL da API não configurada" };
    }

    const { refreshToken } = await getAuthTokens();
    if (!refreshToken) {
      return { success: false, error: "Refresh token não encontrado" };
    }

    const response = await fetch(`${apiUrl}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      return { success: false, error: "Erro ao renovar token" };
    }

    const data: AuthResponse = await response.json();
    await setAuthCookies(data.accessToken, data.refreshToken);
    return { success: true };
  } catch (error) {
    console.error("Erro ao renovar token:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Erro interno do servidor",
    };
  }
}

export async function logoutAction(): Promise<void> {
  try {
    const apiUrl = process.env.BACKEND_URL;
    const { accessToken } = await getAuthTokens();
    if (apiUrl && accessToken) {
      await fetch(`${apiUrl}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
    }
  } catch (error) {
    console.error("Erro ao notificar logout no backend:", error);
  } finally {
    await clearAuthCookies(); // Adiciona await aqui
  }
}

export async function getUserInstancesAction(
  userId: string
): Promise<UserInstanceListResponse> {
  try {
    const apiUrl = process.env.BACKEND_URL;
    if (!apiUrl) {
      return { success: false, error: "URL da API não configurada" };
    }

    const { accessToken } = await getAuthTokens();
    if (!accessToken) {
      return { success: false, error: "Token de acesso não encontrado" };
    }

    const response = await fetch(`${apiUrl}/user-instances/user/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
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
    console.error("Erro ao buscar instâncias do usuário:", error);
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
