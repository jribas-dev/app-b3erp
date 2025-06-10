"use server";

import { LostPasswordFormData } from "@/lib/validations/lost-password.form";
import { ResetPasswordFormData } from "@/lib/validations/reset-password.form";

export interface LostPasswordResponse {
  success: boolean;
  error?: string;
  message?: string;
}

export interface CheckTokenResponse {
  isValid: boolean;
  name?: string;
  email?: string;
}

export interface UpdatePasswordResponse {
  passwordUpdated: boolean;
  name?: string;
  email?: string;
}

export async function lostPasswordAction(
  data: LostPasswordFormData
): Promise<LostPasswordResponse> {
  try {
    const apiUrl = process.env.BACKEND_URL;
    if (!apiUrl) {
      return { success: false, error: "URL da API não configurada" };
    }

    const response = await fetch(`${apiUrl}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.status === 404) {
      return {
        success: false,
        error: "Email não encontrado em nossa base de dados",
      };
    }

    if (response.status === 500) {
      return {
        success: false,
        error: "Erro interno do servidor. Tente novamente mais tarde",
      };
    }

    if (response.status === 200) {
      return {
        success: true,
        message: "Email de recuperação enviado com sucesso!",
      };
    }

    // Para outros códigos de status não esperados
    const errorData = await response.json().catch(() => ({}));
    return {
      success: false,
      error: errorData.message || "Erro inesperado. Tente novamente",
    };
  } catch (error) {
    console.error("Erro ao solicitar recuperação de senha:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erro de conexão com o servidor",
    };
  }
}

export async function checkLostPasswordAction(
  token: string,
  email: string
): Promise<CheckTokenResponse> {
  try {
    const apiUrl = process.env.BACKEND_URL;
    if (!apiUrl) {
      return { isValid: false };
    }

    const response = await fetch(
      `${apiUrl}/auth/reset-password/check?token=${encodeURIComponent(
        token
      )}&email=${encodeURIComponent(email)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      const data = await response.json();
      return data;
    }

    return { isValid: false };
  } catch (error) {
    console.error("Erro ao validar token de recuperação:", error);
    return { isValid: false };
  }
}

export async function updateLostPasswordAction(
  token: string,
  email: string,
  data: ResetPasswordFormData
): Promise<UpdatePasswordResponse> {
  try {
    const apiUrl = process.env.BACKEND_URL;
    if (!apiUrl) {
      return { passwordUpdated: false };
    }

    const response = await fetch(`${apiUrl}/auth/reset-password/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        email,
        password: data.password,
      }),
    });

    if (response.status === 200) {
      const responseData = await response.json();
      return responseData;
    }

    return { passwordUpdated: false };
  } catch (error) {
    console.error("Erro ao atualizar senha:", error);
    return { passwordUpdated: false };
  }
}
