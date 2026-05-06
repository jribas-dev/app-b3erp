"use server";

import type { ActionResult } from "../../api-action";
import { logError } from "../../observability/log";
import type { ViaCepData } from "../schemas";

// Chamada externa ao ViaCEP. Não passa por fetchWithAuth — endpoint público
// sem autenticação. Mantida separada das demais actions de cliente para
// deixar explícito o boundary externo.
export async function buscarCepAction(
  cep: string,
): Promise<ActionResult<ViaCepData>> {
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
      cache: "no-store",
    });
    if (!response.ok) {
      return {
        success: false,
        status: response.status,
        error: "CEP não encontrado",
      };
    }
    const data: ViaCepData = await response.json();
    if (data.erro) {
      return { success: false, error: "CEP não encontrado" };
    }
    return { success: true, data };
  } catch (error) {
    logError("buscarCep", error, { cep });
    return { success: false, error: "Erro ao consultar CEP" };
  }
}
