"use server";

import { createAction } from "../../api-action";
import type {
  ClienteBusca,
  ClienteDetalhe,
  ClienteRedeSP,
} from "../schemas";

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

export const getClientesRedeSPAction = createAction<[], ClienteRedeSP[]>({
  path: () => "/b3vendas/clientes/rede-sp",
  errorMsg: "Erro ao buscar clientes da rede SP",
  scope: "getClientesRedeSP",
});
