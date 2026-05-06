"use server";

import { createAction } from "../../api-action";
import type { MembroEquipe } from "../schemas";

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
