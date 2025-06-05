"use server";

import { ApiResponse } from "@/types/api-response";
import { CompleteRegisterFormData } from "./validations";

/**
 * Verifica o token de pré-cadastro
 */
export async function checkPreRegisterToken(
  email: string,
  token: string
): Promise<ApiResponse> {
  const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3002";
  const url = new URL(`${BACKEND_URL}/user-pre/check`);
  url.searchParams.set("email", email);
  url.searchParams.set("token", token);

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const status = response.status;

    if (response.ok) {
      return {
        success: true,
        status,
        message: "Token válido",
        data: await response.json(),
      };
    } else {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        status,
        message: errorData.message || "Token inválido ou expirado",
      };
    }
  } catch (error) {
    console.log("Erro Verificação /pre-user/check:", error);
    return {
      success: false,
      status: 500,
      message: "Erro de conexão com servidor",
    };
  }
}

/**
 * Completa o registro do usuário
 */
export async function completeUserRegistration(
  email: string,
  token: string,
  formData: CompleteRegisterFormData
): Promise<ApiResponse> {
  try {
    const postObject = {
      user: {
        name: formData.name,
        email,
        password: formData.password,
        phone: formData.phone,
      },
      check: { email, token },
    };
    const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3002";
    const url = new URL(`${BACKEND_URL}/user-pre/confirm`);

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postObject),
    });

    const status = response.status;

    if (response.ok) {
      return {
        success: true,
        status,
        message: "Cadastro concluído com sucesso",
      };
    } else {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        status,
        message: errorData.message || "Erro ao finalizar o cadastro",
      };
    }
  } catch (error) {
    console.error("Erro ao completar cadastro:", error);
    return {
      success: false,
      status: 500,
      message: "Erro de conexão ao finalizar o cadastro",
    };
  }
}
