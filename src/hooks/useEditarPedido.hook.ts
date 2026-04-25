"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  getPedidoAction,
  buscarProdutosAction,
  getProdutoPrecoAction,
  calcImpostoAction,
  adicionarItemAction,
  removerItemAction,
  getFormasPagamentoAction,
  getCondicoesPagamentoAction,
  fecharPedidoAction,
} from "@/lib/vendas.service";
import type {
  PedidoDetalhe,
  ProdutoBusca,
  ProdutoPreco,
  ImpostoCalculado,
  FormaPagamento,
  CondicaoPagamento,
} from "@/types/vendas.types";

const SEARCH_MIN_CHARS = 2;
const SEARCH_DEBOUNCE_MS = 300;

type LoadError = { status?: number; message: string } | null;

// Arredonda para 2 casas decimais seguindo regra de negócio:
// 3º dígito decimal > 5 → arredonda para cima; caso contrário (≤ 5) → para baixo.
function roundPrice(v: number): number {
  if (!Number.isFinite(v) || v < 0) return 0;
  const stable = Math.round(v * 10000) / 10000;
  const str = stable.toFixed(4);
  const [intPart, decPart = "0000"] = str.split(".");
  const d1 = decPart[0] ?? "0";
  const d2 = decPart[1] ?? "0";
  const d3 = parseInt(decPart[2] ?? "0", 10);
  const base = parseFloat(`${intPart}.${d1}${d2}`);
  return d3 > 5 ? Math.round((base + 0.01) * 100) / 100 : base;
}

export function useEditarPedido(idPedido: number | null) {
  const [pedido, setPedido] = useState<PedidoDetalhe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<LoadError>(null);

  const [produtoQuery, setProdutoQuery] = useState("");
  const [produtoResults, setProdutoResults] = useState<ProdutoBusca[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedProduto, setSelectedProduto] = useState<ProdutoBusca | null>(null);
  const [preco, setPreco] = useState<ProdutoPreco | null>(null);
  const [isLoadingPreco, setIsLoadingPreco] = useState(false);
  const [qtde, setQtde] = useState<string>("1");
  const [impostos, setImpostos] = useState<ImpostoCalculado | null>(null);
  const [isCalcImposto, setIsCalcImposto] = useState(false);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [removingSeq, setRemovingSeq] = useState<number | null>(null);

  const [formas, setFormas] = useState<FormaPagamento[]>([]);
  const [condicoes, setCondicoes] = useState<CondicaoPagamento[]>([]);
  const [isLoadingFormas, setIsLoadingFormas] = useState(false);
  const [idForma, setIdForma] = useState<number | null>(null);
  const [idCond, setIdCond] = useState<number | null>(null);
  const [obsInter, setObsInter] = useState("");
  const [isFechando, setIsFechando] = useState(false);
  const [fecharError, setFecharError] = useState<string | null>(null);
  const [fechouOk, setFechouOk] = useState(false);

  const searchSeqRef = useRef(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const impostoSeqRef = useRef(0);

  const isFiscal = pedido?.rcfat === "F";
  const isAberto = pedido?.tipo === "O";

  const loadPedido = useCallback(async () => {
    if (!idPedido) {
      setLoadError({ message: "ID do pedido não informado" });
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setLoadError(null);
    const result = await getPedidoAction(idPedido);
    if (result.success && result.data) {
      setPedido({ ...result.data, itens: result.data.itens ?? [] });
      setObsInter(result.data.obsinter ?? "");
      setIdForma(result.data.idForma);
      setIdCond(result.data.idCond);
    } else {
      setLoadError({
        status: result.status,
        message: result.error || "Erro ao carregar pedido",
      });
    }
    setIsLoading(false);
  }, [idPedido]);

  useEffect(() => {
    loadPedido();
  }, [loadPedido]);

  const loadFormasCondicoes = useCallback(async () => {
    if (!idPedido) return;
    setIsLoadingFormas(true);
    try {
      const [fr, cr] = await Promise.all([
        getFormasPagamentoAction(idPedido),
        getCondicoesPagamentoAction(idPedido),
      ]);
      if (fr.success && fr.data) setFormas(fr.data);
      if (cr.success && cr.data) setCondicoes(cr.data);
    } finally {
      setIsLoadingFormas(false);
    }
  }, [idPedido]);

  const runProdutoSearch = useCallback(async (q: string) => {
    const seq = ++searchSeqRef.current;
    setIsSearching(true);
    setShowResults(true);
    try {
      const result = await buscarProdutosAction(q);
      if (seq !== searchSeqRef.current) return;
      setProdutoResults(result.success && result.data ? result.data : []);
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
        setImpostos(null);
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
      debounceRef.current = setTimeout(() => runProdutoSearch(trimmed), SEARCH_DEBOUNCE_MS);
    },
    [selectedProduto, runProdutoSearch],
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
      setImpostos(null);

      setQtde("1");

      if (!pedido) return;
      setIsLoadingPreco(true);
      try {
        const result = await getProdutoPrecoAction(p.id, pedido.idcli, pedido.idoper);
        if (result.success && result.data) {
          setPreco({
            cfop: result.data.cfop,
            custo: roundPrice(result.data.custo),
            vunit: roundPrice(result.data.vunit),
          });
        } else {
          setPreco(null);
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

  const subtotal = useMemo(() => {
    if (!preco || qtdeNum <= 0) return 0;
    return Number((qtdeNum * preco.vunit).toFixed(2));
  }, [preco, qtdeNum]);

  useEffect(() => {
    if (!pedido || !preco || qtdeNum <= 0 || !selectedProduto) {
      setImpostos(null);
      return;
    }
    if (!isFiscal) {
      setImpostos({ ipi: 0, st: 0, total: 0 });
      return;
    }
    const seq = ++impostoSeqRef.current;
    setIsCalcImposto(true);
    const handle = setTimeout(async () => {
      try {
        const result = await calcImpostoAction(selectedProduto.id, subtotal, pedido.idoper);
        if (seq !== impostoSeqRef.current) return;
        if (result.success && result.data) {
          setImpostos(result.data);
        } else {
          setImpostos(null);
        }
      } finally {
        if (seq === impostoSeqRef.current) setIsCalcImposto(false);
      }
    }, 350);
    return () => clearTimeout(handle);
  }, [pedido, preco, qtdeNum, subtotal, selectedProduto, isFiscal]);

  const canAddItem = !!(
    pedido &&
    isAberto &&
    selectedProduto &&
    preco &&
    qtdeNum > 0 &&
    impostos &&
    !isCalcImposto &&
    !isLoadingPreco &&
    !isAddingItem
  );

  const resetProdutoForm = useCallback(() => {
    setProdutoQuery("");
    setSelectedProduto(null);
    setProdutoResults([]);
    setShowResults(false);
    setPreco(null);
    setImpostos(null);
    setQtde("1");
    setAddError(null);
  }, []);

  const onAdicionarItem = useCallback(async () => {
    if (!pedido || !selectedProduto || !preco || !impostos || qtdeNum <= 0) return;
    setIsAddingItem(true);
    setAddError(null);
    try {
      const result = await adicionarItemAction(pedido.id, {
        idProd: selectedProduto.id,
        qtde: qtdeNum,
        vunit: preco.vunit,
        custo: preco.custo,
        cfop: preco.cfop,
        vST: impostos.st,
        vIPI: impostos.ipi,
        tabela: 0,
      });
      if (result.success) {
        const reload = await getPedidoAction(pedido.id);
        if (reload.success && reload.data) {
          setPedido({ ...reload.data, itens: reload.data.itens ?? [] });
        }
        resetProdutoForm();
      } else {
        setAddError(result.error || "Erro ao adicionar item");
      }
    } finally {
      setIsAddingItem(false);
    }
  }, [pedido, selectedProduto, preco, impostos, qtdeNum, resetProdutoForm]);

  const onRemoverItem = useCallback(
    async (seq: number) => {
      if (!pedido) return;
      setRemovingSeq(seq);
      try {
        const result = await removerItemAction(pedido.id, seq);
        if (result.success) {
          const reload = await getPedidoAction(pedido.id);
          if (reload.success && reload.data) {
            setPedido({ ...reload.data, itens: reload.data.itens ?? [] });
          }
        } else {
          setAddError(result.error || "Erro ao remover item");
        }
      } finally {
        setRemovingSeq(null);
      }
    },
    [pedido],
  );

  const onFechar = useCallback(async () => {
    if (!pedido || !idForma || !idCond) return;
    setIsFechando(true);
    setFecharError(null);
    try {
      const result = await fecharPedidoAction(pedido.id, {
        idForma,
        idCond,
        obsInter: obsInter.trim() || undefined,
      });
      if (result.success && result.data) {
        setPedido(result.data);
        setFechouOk(true);
      } else {
        setFecharError(result.error || "Erro ao fechar pedido");
      }
    } finally {
      setIsFechando(false);
    }
  }, [pedido, idForma, idCond, obsInter]);

  const canFechar = !!(pedido && isAberto && idForma && idCond && !isFechando);

  return {
    pedido,
    isLoading,
    loadError,
    reload: loadPedido,

    isFiscal,
    isAberto,

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
    qtde,
    setQtde,
    qtdeNum,
    subtotal,
    impostos,
    isCalcImposto,
    canAddItem,
    isAddingItem,
    addError,
    onAdicionarItem,

    removingSeq,
    onRemoverItem,

    loadFormasCondicoes,
    isLoadingFormas,
    formas,
    condicoes,
    idForma,
    setIdForma,
    idCond,
    setIdCond,
    obsInter,
    setObsInter,
    canFechar,
    isFechando,
    fecharError,
    onFechar,
    fechouOk,
    setFechouOk,
  };
}
