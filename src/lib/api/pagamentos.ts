import {
  getCondicoesPagamentoAction,
  getFormasPagamentoAction,
} from "@/lib/vendas/pagamentos.service";

export const pagamentosApi = {
  getFormas: getFormasPagamentoAction,
  getCondicoes: getCondicoesPagamentoAction,
};
