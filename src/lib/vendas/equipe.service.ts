"use server";

import type { MembroEquipe } from "@/types/vendas.types";
import { createAction } from "../api-action";

export const getEquipeAction = createAction<[], MembroEquipe[]>({
  path: () => "/b3vendas/equipe",
  errorMsg: "Erro ao buscar equipe",
  scope: "getEquipe",
});

export const getEquipeSemEquipeAction = createAction<[], MembroEquipe[]>({
  path: () => "/b3vendas/equipe/sem-equipe",
  errorMsg: "Erro ao buscar vendedores disponíveis",
  scope: "getEquipeSemEquipe",
});

export const adicionarMembroEquipeAction = createAction<[number], void>({
  path: () => "/b3vendas/equipe",
  method: "POST",
  body: (idcntliderado) => ({ idcntliderado }),
  expectsBody: false,
  errorMsg: "Erro ao adicionar membro",
  scope: "adicionarMembroEquipe",
  onStatus: {
    409: async () => ({
      success: false,
      status: 409,
      error: "Vendedor já pertence a esta equipe",
    }),
    400: async (resp) => {
      const data = await resp.json().catch(() => ({}));
      const msg =
        data && typeof data === "object" && "message" in data
          ? String((data as { message?: unknown }).message ?? "")
          : "";
      return {
        success: false,
        status: 400,
        error: msg || "Operação inválida",
      };
    },
  },
});

export const removerMembroEquipeAction = createAction<[number], void>({
  path: (id) => `/b3vendas/equipe/${id}`,
  method: "DELETE",
  expectsBody: false,
  errorMsg: "Erro ao remover membro",
  scope: "removerMembroEquipe",
  onStatus: {
    404: async () => ({
      success: false,
      status: 404,
      error: "Vínculo não encontrado nesta equipe",
    }),
  },
});
