"use server";

import { setSelectedEmitenteCookie } from "../../auth/cookies";
import { logError } from "../../observability/log";

// "Mutation" local — só escreve cookie. Não chama o backend, mas trata o
// estado da seleção de empresa do usuário, então fica junto das demais
// operações de cfg para ergonomia.
export async function setSelectedEmitenteAction(
  idemp: number,
): Promise<{ success: boolean; error?: string }> {
  if (!Number.isInteger(idemp) || idemp <= 0) {
    logError("setSelectedEmitente", new Error("idemp inválido"), { idemp });
    return { success: false, error: "Empresa inválida" };
  }
  await setSelectedEmitenteCookie(idemp);
  return { success: true };
}
