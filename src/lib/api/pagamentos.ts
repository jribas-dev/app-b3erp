import {
  getCondicoesPagamentoAction,
  getFormasPagamentoAction,
} from "@/lib/vendas/pagamentos";

export const pagamentosApi = {
  getFormas: getFormasPagamentoAction,
  getCondicoes: getCondicoesPagamentoAction,
};
