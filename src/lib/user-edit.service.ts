"use server";

import { cookies } from "next/headers";
import { UserEditFormData } from "@/lib/validations";
import {
  UserData,
  UserUpdateResponse,
  PasswordUpdateResponse,
} from "@/types/user-edit";

async function getAuthTokens() {
  const cookieStore = await cookies();
  return {
    accessToken: cookieStore.get("accessToken")?.value,
  };
}

export async function getUserDataAction(
  userId: string
): Promise<UserData | null> {
  try {
    const apiUrl = process.env.BACKEND_URL;
    if (!apiUrl) {
      console.error("URL da API não configurada");
      return null;
    }

    const { accessToken } = await getAuthTokens();
    if (!accessToken) {
      console.error("Token de acesso não encontrado");
      return null;
    }

    const response = await fetch(`${apiUrl}/users/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Erro ao buscar dados do usuário:", response.status);
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("Erro ao buscar dados do usuário:", error);
    return null;
  }
}

export async function updateUserDataAction(
  userId: string,
  userData: UserEditFormData
): Promise<UserUpdateResponse> {
  try {
    const apiUrl = process.env.BACKEND_URL;
    if (!apiUrl) {
      return { success: false, error: "URL da API não configurada" };
    }

    const { accessToken } = await getAuthTokens();
    if (!accessToken) {
      return { success: false, error: "Token de acesso não encontrado" };
    }

    const response = await fetch(`${apiUrl}/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || "Erro ao atualizar dados do usuário",
      };
    }

    const data: UserData = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Erro ao atualizar dados do usuário:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Erro interno do servidor",
    };
  }
}

export async function updateUserPasswordAction(
  userId: string,
  newPassword: string
): Promise<PasswordUpdateResponse> {
  try {
    const apiUrl = process.env.BACKEND_URL;
    if (!apiUrl) {
      return { success: false, error: "URL da API não configurada" };
    }

    const { accessToken } = await getAuthTokens();
    if (!accessToken) {
      return { success: false, error: "Token de acesso não encontrado" };
    }

    const response = await fetch(`${apiUrl}/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ password: newPassword }),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || "Erro ao alterar senha",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Erro ao alterar senha:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Erro interno do servidor",
    };
  }
}
