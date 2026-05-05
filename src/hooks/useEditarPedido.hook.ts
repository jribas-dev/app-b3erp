"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { pagamentosApi, pedidosApi, produtosApi } from "@/lib/api";
import { roundPrice } from "@/lib/business/preco";
import {
  FechamentoFormSchema,
  EMPTY_FECHAMENTO_FORM,
  toFecharPedidoPayload,
  type FechamentoFormValues,
} from "@/lib/forms/fechamento.form";
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
  const [precoEdit, setPrecoEdit] = useState<string>("");
  const [qtde, setQtde] = useState<string>("1");
  const [impostos, setImpostos] = useState<ImpostoCalculado | null>(null);
  const [isCalcImposto, setIsCalcImposto] = useState(false);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [removingSeq, setRemovingSeq] = useState<number | null>(null);

  const [formas, setFormas] = useState<FormaPagamento[]>([]);
  const [condicoes, setCondicoes] = useState<CondicaoPagamento[]>([]);
  const [isLoadingFormas, setIsLoadingFormas] = useState(false);
  const [fecharError, setFecharError] = useState<string | null>(null);
  const [fechouOk, setFechouOk] = useState(false);

  const fechamentoForm = useForm<FechamentoFormValues>({
    resolver: zodResolver(FechamentoFormSchema),
    defaultValues: EMPTY_FECHAMENTO_FORM,
    mode: "onChange",
  });
  const {
    handleSubmit: handleFecharSubmit,
    reset: resetFechamento,
    formState: { isValid: isFechamentoValid, isSubmitting: isFechando },
  } = fechamentoForm;

  const searchSeqRef = useRef(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const impostoSeqRef = useRef(0);

  const isFiscal = pedido?.fiscal === "F";
  const isAberto = pedido?.tipo === "O";

  const loadPedido = useCallback(async () => {
    if (!idPedido) {
      setLoadError({ message: "ID do pedido não informado" });
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setLoadError(null);
    const result = await pedidosApi.getById(idPedido);
    if (result.success) {
      setPedido({ ...result.data, itens: result.data.itens ?? [] });
      resetFechamento({
        idForma: result.data.idForma ? String(result.data.idForma) : "",
        idCond: result.data.idCond ? String(result.data.idCond) : "",
        obsInter: result.data.obsinter ?? "",
      });
    } else {
      setLoadError({
        status: result.status,
        message: result.error || "Erro ao carregar pedido",
      });
    }
    setIsLoading(false);
  }, [idPedido, resetFechamento]);

  useEffect(() => {
    loadPedido();
  }, [loadPedido]);

  const loadFormasCondicoes = useCallback(async () => {
    if (!idPedido) return;
    setIsLoadingFormas(true);
    try {
      const [fr, cr] = await Promise.all([
        pagamentosApi.getFormas(idPedido),
        pagamentosApi.getCondicoes(idPedido),
      ]);
      if (fr.success) setFormas(fr.data);
      if (cr.success) setCondicoes(cr.data);
    } finally {
      setIsLoadingFormas(false);
    }
  }, [idPedido]);

  const runProdutoSearch = useCallback(async (q: string) => {
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
        const result = await produtosApi.getPreco(p.id, pedido.idcli, pedido.idoper);
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

  useEffect(() => {
    if (!pedido || !preco || qtdeNum <= 0 || precoNum <= 0 || !selectedProduto) {
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
        const result = await produtosApi.calcImposto(selectedProduto.id, subtotal, pedido.idoper);
        if (seq !== impostoSeqRef.current) return;
        if (result.success) {
          setImpostos(result.data);
        } else {
          setImpostos(null);
        }
      } finally {
        if (seq === impostoSeqRef.current) setIsCalcImposto(false);
      }
    }, 350);
    return () => clearTimeout(handle);
  }, [pedido, preco, qtdeNum, precoNum, subtotal, selectedProduto, isFiscal]);

  const canAddItem = !!(
    pedido &&
    isAberto &&
    selectedProduto &&
    preco &&
    qtdeNum > 0 &&
    precoNum > 0 &&
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
    setPrecoEdit("");
    setImpostos(null);
    setQtde("1");
    setAddError(null);
  }, []);

  const onAdicionarItem = useCallback(async () => {
    if (!pedido || !selectedProduto || !preco || !impostos || qtdeNum <= 0 || precoNum <= 0) return;
    setIsAddingItem(true);
    setAddError(null);
    try {
      const result = await pedidosApi.addItem(pedido.id, {
        idProd: selectedProduto.id,
        qtde: qtdeNum,
        vunit: precoNum,
        custo: preco.custo,
        cfop: preco.cfop,
        vST: impostos.st,
        vIPI: impostos.ipi,
        tabela: 0,
      });
      if (result.success) {
        const reload = await pedidosApi.getById(pedido.id);
        if (reload.success) {
          setPedido({ ...reload.data, itens: reload.data.itens ?? [] });
        }
        resetProdutoForm();
      } else {
        setAddError(result.error || "Erro ao adicionar item");
      }
    } finally {
      setIsAddingItem(false);
    }
  }, [pedido, selectedProduto, preco, impostos, qtdeNum, precoNum, resetProdutoForm]);

  const onRemoverItem = useCallback(
    async (seq: number) => {
      if (!pedido) return;
      setRemovingSeq(seq);
      try {
        const result = await pedidosApi.removeItem(pedido.id, seq);
        if (result.success) {
          const reload = await pedidosApi.getById(pedido.id);
          if (reload.success) {
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

  const onFechar = handleFecharSubmit(async (values) => {
    if (!pedido) return;
    setFecharError(null);
    const result = await pedidosApi.fechar(
      pedido.id,
      toFecharPedidoPayload(values),
    );
    if (result.success) {
      setPedido(result.data);
      setFechouOk(true);
    } else {
      setFecharError(result.error || "Erro ao fechar pedido");
    }
  });

  const canFechar = !!(
    pedido &&
    isAberto &&
    isFechamentoValid &&
    !isFechando
  );

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
    precoEdit,
    setPrecoEdit,
    precoNum,
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
    fechamentoForm,
    canFechar,
    isFechando,
    fecharError,
    onFechar,
    fechouOk,
    setFechouOk,
  };
}
