import {
  buscarProdutosAction,
  calcImpostoAction,
  getProdutoPrecoAction,
} from "@/lib/vendas/produtos";

export const produtosApi = {
  search: buscarProdutosAction,
  getPreco: getProdutoPrecoAction,
  calcImposto: calcImpostoAction,
};
