"use server";

import { z } from "zod";

import { createAction } from "../../api-action";
import {
  ClienteFormPayloadPartialSchema,
  ClienteFormPayloadSchema,
  type ClienteDetalhe,
  type ClienteFormPayload,
  positiveIdSchema,
} from "../schemas";

export const criarClienteAction = createAction<
  [ClienteFormPayload],
  ClienteDetalhe
>({
  path: () => "/b3vendas/clientes",
  method: "POST",
  body: (payload) => payload,
  errorMsg: "Erro ao criar cliente",
  scope: "criarCliente",
  inputSchema: z.tuple([ClienteFormPayloadSchema]),
});

export const atualizarClienteAction = createAction<
  [number, Partial<ClienteFormPayload>],
  ClienteDetalhe
>({
  path: (id) => `/b3vendas/clientes/${id}`,
  method: "PATCH",
  body: (_id, payload) => payload,
  errorMsg: "Erro ao atualizar cliente",
  scope: "atualizarCliente",
  inputSchema: z.tuple([positiveIdSchema, ClienteFormPayloadPartialSchema]),
  onStatus: {
    403: async () => ({
      success: false,
      status: 403,
      error: "Sem permissão para alterar este cliente",
    }),
  },
});
