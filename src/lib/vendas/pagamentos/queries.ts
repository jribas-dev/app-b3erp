"use server";

import { createAction } from "../../api-action";
import type { CondicaoPagamento, FormaPagamento } from "../schemas";

export const getFormasPagamentoAction = createAction<
  [number],
  FormaPagamento[]
>({
  path: (idPedido) => `/b3vendas/pedidos/${idPedido}/formas-disponiveis`,
  errorMsg: "Erro ao buscar formas de pagamento",
  scope: "getFormasPagamento",
});

export const getCondicoesPagamentoAction = createAction<
  [number],
  CondicaoPagamento[]
>({
  path: (idPedido) => `/b3vendas/pedidos/${idPedido}/condicoes-disponiveis`,
  errorMsg: "Erro ao buscar condições de pagamento",
  scope: "getCondicoesPagamento",
});
