"use server";

import { createAction } from "../../api-action";
import type { PedidoDetalhe, PedidoLista } from "../schemas";

export const getPedidoAction = createAction<[number], PedidoDetalhe>({
  path: (id) => `/b3vendas/pedidos/${id}`,
  errorMsg: "Erro ao buscar pedido",
  scope: "getPedido",
});

export const getPedidosEditaveisAction = createAction<[number], PedidoLista[]>({
  path: (idemp) => `/b3vendas/pedidos/editaveis?idemp=${idemp}`,
  errorMsg: "Erro ao buscar pedidos em aberto",
  scope: "getPedidosEditaveis",
});

export const getPedidosFechadosAction = createAction<[number], PedidoLista[]>({
  path: (idemp) => `/b3vendas/pedidos/fechados?idemp=${idemp}`,
  errorMsg: "Erro ao buscar histórico de pedidos",
  scope: "getPedidosFechados",
});
