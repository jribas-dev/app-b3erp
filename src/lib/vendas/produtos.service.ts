"use server";

import type {
  ImpostoCalculado,
  ProdutoBusca,
  ProdutoPreco,
} from "@/types/vendas.types";
import { createAction } from "../api-action";

export const buscarProdutosAction = createAction<[string], ProdutoBusca[]>({
  path: (q) => `/b3vendas/produtos/buscar?q=${encodeURIComponent(q)}`,
  errorMsg: "Erro ao buscar produtos",
  scope: "buscarProdutos",
});

export const getProdutoPrecoAction = createAction<
  [number, number, number],
  ProdutoPreco
>({
  path: (idProd, idCli, idOper) =>
    `/b3vendas/produtos/${idProd}/preco?idCli=${idCli}&idOper=${idOper}`,
  errorMsg: "Erro ao buscar preço do produto",
  scope: "getProdutoPreco",
});

export const calcImpostoAction = createAction<
  [number, number, number],
  ImpostoCalculado
>({
  path: (idProd) => `/b3vendas/produtos/${idProd}/calc-imposto`,
  method: "POST",
  body: (_idProd, subtotal, idOper) => ({ subtotal, idOper }),
  errorMsg: "Erro ao calcular impostos",
  scope: "calcImposto",
});
