"use server";

import { ApiResponse } from "@/types/api-response";

/**
 * Verifica o token de pré-cadastro
 */
export async function checkPreRegisterToken(
  email: string,
  token: string
): Promise<ApiResponse> {
  // URL da API backend
  const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3002";

  // Constrói a URL com os parâmetros de query
  const url = new URL(`${BACKEND_URL}/user-pre/check`);
  url.searchParams.set("email", email);
  url.searchParams.set("token", token);

  // Faz a chamada GET para a API
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
