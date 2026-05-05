"use server";

import { UserEditFormData } from "@/lib/forms/user-edit.form";
import {
  UserData,
  UserUpdateResponse,
  PasswordUpdateResponse,
} from "@/types/user-edit";
import { fetchWithAuth } from "./api-client";
import { logError } from "./observability/log";

export async function getUserDataAction(
  userId: string
): Promise<UserData | null> {
  try {
    const response = await fetchWithAuth(`/users/${userId}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      logError("getUserData", new Error(`HTTP ${response.status}`), { userId });
      return null;
    }

    return response.json();
  } catch (error) {
    logError("getUserData", error, { userId });
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
    logError("updateUserData", error, { userId });
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
    logError("updateUserPassword", error, { userId });
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Erro interno do servidor",
    };
  }
}
