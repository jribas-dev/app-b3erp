"use server";

import type { Emitente, Operacao, TenantCfg } from "@/types/vendas.types";
import { createAction } from "../api-action";
import {
  getSelectedEmitenteCookie,
  setSelectedEmitenteCookie,
} from "../auth/cookies";
import { logError } from "../observability/log";

export const getEmitentesAction = createAction<[], Emitente[]>({
  path: () => "/tenant/emitentes",
  errorMsg: "Erro ao buscar empresas",
  scope: "getEmitentes",
});

export const getOperacoesAction = createAction<[number], Operacao[]>({
  path: (idemp) => `/b3vendas/operacoes?idemp=${idemp}`,
  errorMsg: "Erro ao buscar operações",
  scope: "getOperacoes",
});

export const getTenantCfgAction = createAction<[string], TenantCfg>({
  path: (param) => `/tenant/cfg?param=${encodeURIComponent(param)}`,
  errorMsg: "Erro ao buscar configuração do tenant",
  scope: "getTenantCfg",
  onStatus: {
    404: async () => ({
      success: false,
      status: 404,
      error: "Configuração não encontrada",
    }),
  },
});

export async function getSelectedEmitenteAction(): Promise<number | null> {
  return getSelectedEmitenteCookie();
}

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
