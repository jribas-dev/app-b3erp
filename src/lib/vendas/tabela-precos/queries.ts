"use server";

import { createAction } from "../../api-action";
import type { ItemTabelaPrecos } from "../schemas";

export const getTabelaPrecosAction = createAction<
  [number, number],
  ItemTabelaPrecos[]
>({
  path: (idOper, idCli) =>
    `/b3vendas/clientes/tabela?idOper=${idOper}&idCli=${idCli}`,
  errorMsg: "Erro ao buscar tabela de preços",
  scope: "getTabelaPrecos",
});
