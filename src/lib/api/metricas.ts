import {
  getClientesInativosAction,
  getTopClientesAtivosAction,
  getVendasMensaisAction,
  getVendasSemanaisAction,
} from "@/lib/vendas/metricas.service";

export type { MetricaQuery } from "@/lib/vendas/metricas.service";

export const metricasApi = {
  vendasSemanais: getVendasSemanaisAction,
  vendasMensais: getVendasMensaisAction,
  topClientesAtivos: getTopClientesAtivosAction,
  clientesInativos: getClientesInativosAction,
};
