"use server";

import { z } from "zod";

import { createAction } from "../../api-action";
import {
  AdicionarItemPayloadSchema,
  FecharPedidoPayloadSchema,
  NovoPedidoPayloadSchema,
  positiveIdSchema,
  type AdicionarItemPayload,
  type FecharPedidoPayload,
  type NovoPedidoPayload,
  type PedidoCriado,
  type PedidoDetalhe,
} from "../schemas";

export const criarPedidoAction = createAction<
  [NovoPedidoPayload],
  PedidoCriado
>({
  path: () => "/b3vendas/pedidos",
  method: "POST",
  body: (payload) => payload,
  errorMsg: "Erro ao criar pedido",
  scope: "criarPedido",
  inputSchema: z.tuple([NovoPedidoPayloadSchema]),
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
  inputSchema: z.tuple([positiveIdSchema, FecharPedidoPayloadSchema]),
});

export const adicionarItemAction = createAction<
  [number, AdicionarItemPayload],
  PedidoDetalhe
>({
  path: (idPedido) => `/b3vendas/pedidos/${idPedido}/itens`,
  method: "POST",
  body: (_idPedido, payload) => payload,
  errorMsg: "Erro ao adicionar item",
  scope: "adicionarItem",
  inputSchema: z.tuple([positiveIdSchema, AdicionarItemPayloadSchema]),
});

export const removerItemAction = createAction<[number, number], void>({
  path: (idPedido, seq) => `/b3vendas/pedidos/${idPedido}/itens/${seq}`,
  method: "DELETE",
  expectsBody: false,
  errorMsg: "Erro ao remover item",
  scope: "removerItem",
});
