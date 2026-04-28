"use server";

import { z } from "zod";
import type {
  FecharPedidoPayload,
  NovoPedidoPayload,
  PedidoCriado,
  PedidoDetalhe,
  PedidoLista,
} from "@/types/vendas.types";
import { createAction } from "../api-action";
import {
  FecharPedidoPayloadSchema,
  NovoPedidoPayloadSchema,
} from "./schemas";

const positiveId = z.number().int().positive();

export const criarPedidoAction = createAction<[NovoPedidoPayload], PedidoCriado>({
  path: () => "/b3vendas/pedidos",
  method: "POST",
  body: (payload) => payload,
  errorMsg: "Erro ao criar pedido",
  scope: "criarPedido",
  inputSchema: z.tuple([NovoPedidoPayloadSchema]),
});

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

export const fecharPedidoAction = createAction<
  [number, FecharPedidoPayload],
  PedidoDetalhe
>({
  path: (idPedido) => `/b3vendas/pedidos/${idPedido}/fechar`,
  method: "POST",
  body: (_idPedido, payload) => payload,
  errorMsg: "Erro ao fechar pedido",
  scope: "fecharPedido",
  inputSchema: z.tuple([positiveId, FecharPedidoPayloadSchema]),
});
