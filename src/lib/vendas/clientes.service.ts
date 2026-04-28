"use server";

import type {
  ClienteBusca,
  ClienteDetalhe,
  ClienteFormPayload,
  ClienteRedeSP,
  ViaCepData,
} from "@/types/vendas.types";
import { z } from "zod";
import { createAction, type ActionResult } from "../api-action";
import { logError } from "../observability/log";
import {
  ClienteFormPayloadPartialSchema,
  ClienteFormPayloadSchema,
} from "./schemas";

const positiveId = z.number().int().positive();

export const buscarClientesAction = createAction<[string], ClienteBusca[]>({
  path: (q) => `/b3vendas/clientes/buscar?q=${encodeURIComponent(q)}`,
  errorMsg: "Erro ao buscar clientes",
  scope: "buscarClientes",
});

export const getClienteAction = createAction<[number], ClienteDetalhe>({
  path: (id) => `/b3vendas/clientes/${id}`,
  errorMsg: "Erro ao buscar cliente",
  scope: "getCliente",
});

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
  inputSchema: z.tuple([positiveId, ClienteFormPayloadPartialSchema]),
  onStatus: {
    403: async () => ({
      success: false,
      status: 403,
      error: "Sem permissão para alterar este cliente",
    }),
  },
});

export const getClientesRedeSPAction = createAction<[], ClienteRedeSP[]>({
  path: () => "/b3vendas/clientes/rede-sp",
  errorMsg: "Erro ao buscar clientes da rede SP",
  scope: "getClientesRedeSP",
});

// buscarCep — chamada externa ao ViaCEP, não passa por fetchWithAuth.
export async function buscarCepAction(
  cep: string,
): Promise<ActionResult<ViaCepData>> {
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
      cache: "no-store",
    });
    if (!response.ok) {
      return {
        success: false,
        status: response.status,
        error: "CEP não encontrado",
      };
    }
    const data: ViaCepData = await response.json();
    if (data.erro) {
      return { success: false, error: "CEP não encontrado" };
    }
    return { success: true, data };
  } catch (error) {
    logError("buscarCep", error, { cep });
    return { success: false, error: "Erro ao consultar CEP" };
  }
}
