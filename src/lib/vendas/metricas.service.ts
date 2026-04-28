"use server";

import type {
  ClienteInativo,
  MetricaChartResponse,
} from "@/types/vendas.types";
import { createAction } from "../api-action";

export const getVendasSemanaisAction = createAction<[], MetricaChartResponse>({
  path: () => "/b3vendas/metricas/vendas-semanais",
  errorMsg: "Erro ao buscar vendas semanais",
  scope: "getVendasSemanais",
});

export const getVendasMensaisAction = createAction<[], MetricaChartResponse>({
  path: () => "/b3vendas/metricas/vendas-mensais",
  errorMsg: "Erro ao buscar vendas mensais",
  scope: "getVendasMensais",
});

export const getTopClientesAtivosAction = createAction<[], MetricaChartResponse>({
  path: () => "/b3vendas/metricas/top-clientes-ativos",
  errorMsg: "Erro ao buscar top clientes",
  scope: "getTopClientesAtivos",
});

export const getClientesInativosAction = createAction<[], ClienteInativo[]>({
  path: () => "/b3vendas/metricas/clientes-inativos",
  errorMsg: "Erro ao buscar clientes inativos",
  scope: "getClientesInativos",
});
