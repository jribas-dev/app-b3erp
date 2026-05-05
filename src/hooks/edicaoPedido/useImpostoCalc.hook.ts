"use client";

import { useEffect, useRef, useState } from "react";

import { produtosApi } from "@/lib/api";
import type {
  ImpostoCalculado,
  PedidoDetalhe,
  ProdutoBusca,
  ProdutoPreco,
} from "@/lib/vendas/schemas";

const DEBOUNCE_MS = 350;

interface UseImpostoCalcArgs {
  pedido: PedidoDetalhe | null;
  selectedProduto: ProdutoBusca | null;
  preco: ProdutoPreco | null;
  qtdeNum: number;
  precoNum: number;
  subtotal: number;
  isFiscal: boolean;
}

// Cálculo reativo de impostos. Quando o pedido é fiscal, debounce + chamada
// ao backend; quando não, zera tudo. Sequence guard evita race quando o
// usuário digita rápido na qtde/preço.
export function useImpostoCalc({
  pedido,
  selectedProduto,
  preco,
  qtdeNum,
  precoNum,
  subtotal,
  isFiscal,
}: UseImpostoCalcArgs) {
  const [impostos, setImpostos] = useState<ImpostoCalculado | null>(null);
  const [isCalcImposto, setIsCalcImposto] = useState(false);
  const seqRef = useRef(0);

  useEffect(() => {
    if (
      !pedido ||
      !preco ||
      qtdeNum <= 0 ||
      precoNum <= 0 ||
      !selectedProduto
    ) {
      setImpostos(null);
      return;
    }
    if (!isFiscal) {
      setImpostos({ ipi: 0, st: 0, total: 0 });
      return;
    }
    const seq = ++seqRef.current;
    setIsCalcImposto(true);
    const handle = setTimeout(async () => {
      try {
        const result = await produtosApi.calcImposto(
          selectedProduto.id,
          subtotal,
          pedido.idoper,
        );
        if (seq !== seqRef.current) return;
        setImpostos(result.success ? result.data : null);
      } finally {
        if (seq === seqRef.current) setIsCalcImposto(false);
      }
    }, DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [pedido, preco, qtdeNum, precoNum, subtotal, selectedProduto, isFiscal]);

  return { impostos, setImpostos, isCalcImposto };
}
