"use client";

import { useCallback, useMemo, useRef, useState } from "react";

import { produtosApi } from "@/lib/api";
import { roundPrice } from "@/lib/business/preco";
import type {
  PedidoDetalhe,
  ProdutoBusca,
  ProdutoPreco,
} from "@/lib/vendas/schemas";

const SEARCH_MIN_CHARS = 2;
const SEARCH_DEBOUNCE_MS = 300;

// Encapsula o "painel de adicionar produto" do pedido em edição:
// busca debounced, seleção, fetch de preço e os inputs de qtde/preço com
// seus computeds. Expõe `resetProdutoForm` para o orquestrador chamar após
// o item ser persistido.
export function useProdutoSearch(pedido: PedidoDetalhe | null) {
  const [produtoQuery, setProdutoQuery] = useState("");
  const [produtoResults, setProdutoResults] = useState<ProdutoBusca[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedProduto, setSelectedProduto] = useState<ProdutoBusca | null>(
    null,
  );
  const [preco, setPreco] = useState<ProdutoPreco | null>(null);
  const [isLoadingPreco, setIsLoadingPreco] = useState(false);
  const [precoEdit, setPrecoEdit] = useState<string>("");
  const [qtde, setQtde] = useState<string>("1");
  const [addError, setAddError] = useState<string | null>(null);

  const searchSeqRef = useRef(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runSearch = useCallback(async (q: string) => {
    const seq = ++searchSeqRef.current;
    setIsSearching(true);
    setShowResults(true);
    try {
      const result = await produtosApi.search(q);
      if (seq !== searchSeqRef.current) return;
      setProdutoResults(result.success ? result.data : []);
    } finally {
      if (seq === searchSeqRef.current) setIsSearching(false);
    }
  }, []);

  const onProdutoQueryChange = useCallback(
    (value: string) => {
      setProdutoQuery(value);
      if (selectedProduto && value !== selectedProduto.display) {
        setSelectedProduto(null);
        setPreco(null);
      }
      if (debounceRef.current) clearTimeout(debounceRef.current);
      const trimmed = value.trim();
      if (trimmed.length < SEARCH_MIN_CHARS) {
        searchSeqRef.current++;
        setIsSearching(false);
        setShowResults(false);
        setProdutoResults([]);
        return;
      }
      debounceRef.current = setTimeout(
        () => runSearch(trimmed),
        SEARCH_DEBOUNCE_MS,
      );
    },
    [selectedProduto, runSearch],
  );

  const onProdutoSelect = useCallback(
    async (p: ProdutoBusca) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      searchSeqRef.current++;
      setShowResults(false);
      setIsSearching(false);
      setSelectedProduto(p);
      setProdutoQuery(p.display);
      setProdutoResults([]);
      setQtde("1");

      if (!pedido) return;
      setIsLoadingPreco(true);
      try {
        const result = await produtosApi.getPreco(
          p.id,
          pedido.idcli,
          pedido.idoper,
        );
        if (result.success) {
          const vunit = roundPrice(result.data.vunit);
          setPreco({
            cfop: result.data.cfop,
            custo: roundPrice(result.data.custo),
            vunit,
          });
          setPrecoEdit(vunit.toFixed(2));
        } else {
          setPreco(null);
          setPrecoEdit("");
          setAddError(result.error || "Erro ao buscar preço");
        }
      } finally {
        setIsLoadingPreco(false);
      }
    },
    [pedido],
  );

  const qtdeNum = useMemo(() => {
    const n = Number(qtde.replace(",", "."));
    return Number.isFinite(n) && n > 0 ? n : 0;
  }, [qtde]);

  const precoNum = useMemo(() => {
    const n = Number(precoEdit.replace(",", "."));
    return Number.isFinite(n) && n > 0 ? n : 0;
  }, [precoEdit]);

  const subtotal = useMemo(() => {
    if (!preco || qtdeNum <= 0 || precoNum <= 0) return 0;
    return Number((qtdeNum * precoNum).toFixed(2));
  }, [preco, qtdeNum, precoNum]);

  const resetProdutoForm = useCallback(() => {
    setProdutoQuery("");
    setSelectedProduto(null);
    setProdutoResults([]);
    setShowResults(false);
    setPreco(null);
    setPrecoEdit("");
    setQtde("1");
    setAddError(null);
  }, []);

  return {
    produtoQuery,
    onProdutoQueryChange,
    produtoResults,
    isSearching,
    showResults,
    setShowResults,
    selectedProduto,
    onProdutoSelect,
    preco,
    isLoadingPreco,
    precoEdit,
    setPrecoEdit,
    precoNum,
    qtde,
    setQtde,
    qtdeNum,
    subtotal,
    addError,
    setAddError,
    resetProdutoForm,
  };
}
