"use server";

import { z } from "zod";
import type {
  AdicionarItemPayload,
  PedidoDetalhe,
} from "@/types/vendas.types";
import { createAction } from "../api-action";
import { AdicionarItemPayloadSchema } from "./schemas";

const positiveId = z.number().int().positive();

export const adicionarItemAction = createAction<
  [number, AdicionarItemPayload],
  PedidoDetalhe
>({
  path: (idPedido) => `/b3vendas/pedidos/${idPedido}/itens`,
  method: "POST",
  body: (_idPedido, payload) => payload,
  errorMsg: "Erro ao adicionar item",
  scope: "adicionarItem",
  inputSchema: z.tuple([positiveId, AdicionarItemPayloadSchema]),
});

export const removerItemAction = createAction<[number, number], void>({
  path: (idPedido, seq) => `/b3vendas/pedidos/${idPedido}/itens/${seq}`,
  method: "DELETE",
  expectsBody: false,
  errorMsg: "Erro ao remover item",
  scope: "removerItem",
});
