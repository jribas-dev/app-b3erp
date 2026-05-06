import {
  adicionarMembroEquipeAction,
  getEquipeAction,
  getEquipeSemEquipeAction,
  removerMembroEquipeAction,
} from "@/lib/vendas/equipe";

export const equipeApi = {
  list: getEquipeAction,
  listAvailable: getEquipeSemEquipeAction,
  addMembro: adicionarMembroEquipeAction,
  removeMembro: removerMembroEquipeAction,
};
