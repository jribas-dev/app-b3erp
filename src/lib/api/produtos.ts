import {
  buscarProdutosAction,
  calcImpostoAction,
  getProdutoPrecoAction,
} from "@/lib/vendas/produtos.service";

export const produtosApi = {
  search: buscarProdutosAction,
  getPreco: getProdutoPrecoAction,
  calcImposto: calcImpostoAction,
};
