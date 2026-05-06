import {
  getClientesInativosAction,
  getTopClientesAtivosAction,
  getVendasMensaisAction,
  getVendasSemanaisAction,
} from "@/lib/vendas/metricas";

export type { MetricaQuery } from "@/lib/vendas/metricas";

export const metricasApi = {
  vendasSemanais: getVendasSemanaisAction,
  vendasMensais: getVendasMensaisAction,
  topClientesAtivos: getTopClientesAtivosAction,
  clientesInativos: getClientesInativosAction,
};
