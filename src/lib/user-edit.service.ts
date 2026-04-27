"use server";

import { UserEditFormData } from "@/lib/validations/user-edit.form";
import {
  UserData,
  UserUpdateResponse,
  PasswordUpdateResponse,
} from "@/types/user-edit";
import { fetchWithAuth } from "./api-client";

export async function getUserDataAction(
  userId: string
): Promise<UserData | null> {
  try {
    const response = await fetchWithAuth(`/users/${userId}`, {
      method: "GET",
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
    const response = await fetchWithAuth(`/users/${userId}`, {
      method: "PATCH",
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
    const response = await fetchWithAuth(`/users/${userId}`, {
      method: "PATCH",
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
