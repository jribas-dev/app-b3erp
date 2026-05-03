"use server";

import type {
  ClienteInativo,
  MetricaChartResponse,
} from "@/types/vendas.types";
import { createAction } from "../api-action";

export interface MetricaQuery {
  idemp: number;
  idvende: number;
  join?: boolean;
}

function buildMetricaPath(base: string, q: MetricaQuery): string {
  const params = new URLSearchParams();
  params.set("idemp", String(q.idemp));
  params.set("idvende", String(q.idvende));
  if (q.join) params.set("join", "true");
  return `${base}?${params.toString()}`;
}

export const getVendasSemanaisAction = createAction<
  [MetricaQuery],
  MetricaChartResponse
>({
  path: (q) => buildMetricaPath("/b3vendas/metricas/vendas-semanais", q),
  errorMsg: "Erro ao buscar vendas semanais",
  scope: "getVendasSemanais",
});

export const getVendasMensaisAction = createAction<
  [MetricaQuery],
  MetricaChartResponse
>({
  path: (q) => buildMetricaPath("/b3vendas/metricas/vendas-mensais", q),
  errorMsg: "Erro ao buscar vendas mensais",
  scope: "getVendasMensais",
});

export const getTopClientesAtivosAction = createAction<
  [MetricaQuery],
  MetricaChartResponse
>({
  path: (q) => buildMetricaPath("/b3vendas/metricas/top-clientes-ativos", q),
  errorMsg: "Erro ao buscar top clientes",
  scope: "getTopClientesAtivos",
});

export const getClientesInativosAction = createAction<
  [MetricaQuery],
  ClienteInativo[]
>({
  path: (q) => buildMetricaPath("/b3vendas/metricas/clientes-inativos", q),
  errorMsg: "Erro ao buscar clientes inativos",
  scope: "getClientesInativos",
});
