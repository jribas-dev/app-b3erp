"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  getEmitentesAction,
  getOperacoesAction,
  getTenantCfgAction,
  buscarClientesAction,
  getClienteAction,
  criarPedidoAction,
} from "@/lib/vendas.service";
import type { Emitente, Operacao, ClienteBusca, ClienteDetalhe } from "@/types/vendas.types";

const SEARCH_MIN_CHARS = 3;
const SEARCH_DEBOUNCE_MS = 300;

export function useNovoPedido() {
  const router = useRouter();

  const [emitentes, setEmitentes] = useState<Emitente[]>([]);
  const [isLoadingEmitentes, setIsLoadingEmitentes] = useState(true);
  const [selectedIdemp, setSelectedIdemp] = useState<number | null>(null);

  const [operacoes, setOperacoes] = useState<Operacao[]>([]);
  const [isLoadingOperacoes, setIsLoadingOperacoes] = useState(false);
  const [selectedIdOper, setSelectedIdOper] = useState<number | null>(null);

  const [clienteQuery, setClienteQuery] = useState("");
  const [clienteResults, setClienteResults] = useState<ClienteBusca[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<ClienteDetalhe | null>(null);
  const [isLoadingCliente, setIsLoadingCliente] = useState(false);

  const [rcfat, setRcfat] = useState<"F" | "E">("E");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const searchSeqRef = useRef(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const emitenteTriggerRef = useRef<HTMLButtonElement>(null);
  const operacaoTriggerRef = useRef<HTMLButtonElement>(null);
  const clienteInputRef = useRef<HTMLInputElement>(null);
  const initialFocusDoneRef = useRef(false);

  const loadOperacoes = useCallback(async (idemp: number) => {
    setIsLoadingOperacoes(true);
    setOperacoes([]);
    setSelectedIdOper(null);
    try {
      const result = await getOperacoesAction(idemp);
      if (result.success && result.data) {
        const lista = result.data;
        setOperacoes(lista);

        if (lista.length > 0) {
          const cfg = await getTenantCfgAction("VOPERPADRAO");
          const fromCfg = cfg.success && cfg.data ? Number(cfg.data.valor) : NaN;
          const defaultOp =
            Number.isFinite(fromCfg) && lista.some((op) => op.id === fromCfg)
              ? fromCfg
              : lista.find((op) => op.id === 1)?.id ?? null;

          setSelectedIdOper(defaultOp);
        }
      }
    } finally {
      setIsLoadingOperacoes(false);
    }
  }, []);

  const loadEmitentes = useCallback(async () => {
    setIsLoadingEmitentes(true);
    try {
      const result = await getEmitentesAction();
      if (result.success && result.data) {
        setEmitentes(result.data);
        if (result.data.length === 1) {
          const id = result.data[0].id;
          setSelectedIdemp(id);
          await loadOperacoes(id);
        }
      }
    } finally {
      setIsLoadingEmitentes(false);
    }
  }, [loadOperacoes]);

  useEffect(() => {
    loadEmitentes();
  }, [loadEmitentes]);

  useEffect(() => {
    if (initialFocusDoneRef.current) return;
    if (isLoadingEmitentes) return;

    if (!selectedIdemp) {
      emitenteTriggerRef.current?.focus();
      initialFocusDoneRef.current = true;
      return;
    }

    if (isLoadingOperacoes) return;

    if (selectedIdOper) {
      clienteInputRef.current?.focus();
    } else {
      operacaoTriggerRef.current?.focus();
    }
    initialFocusDoneRef.current = true;
  }, [isLoadingEmitentes, selectedIdemp, isLoadingOperacoes, selectedIdOper]);

  const onIdemandChange = useCallback(
    (idemp: number) => {
      setSelectedIdemp(idemp);
      setSelectedCliente(null);
      setClienteQuery("");
      setClienteResults([]);
      setShowResults(false);
      loadOperacoes(idemp);
    },
    [loadOperacoes],
  );

  const runSearch = useCallback(async (q: string) => {
    const seq = ++searchSeqRef.current;
    setIsSearching(true);
    setShowResults(true);
    try {
      const result = await buscarClientesAction(q);
      if (seq !== searchSeqRef.current) return; // resultado antigo
      if (result.success && result.data) {
        setClienteResults(result.data);
      } else {
        setClienteResults([]);
      }
    } finally {
      if (seq === searchSeqRef.current) setIsSearching(false);
    }
  }, []);

  const onClienteQueryChange = useCallback(
    (value: string) => {
      setClienteQuery(value);
      if (selectedCliente && value !== selectedCliente.razao) {
        setSelectedCliente(null);
      }

      if (debounceRef.current) clearTimeout(debounceRef.current);

      const trimmed = value.trim();
      if (trimmed.length < SEARCH_MIN_CHARS) {
        searchSeqRef.current++; // invalida buscas em andamento
        setIsSearching(false);
        setShowResults(false);
        setClienteResults([]);
        return;
      }

      debounceRef.current = setTimeout(() => {
        runSearch(trimmed);
      }, SEARCH_DEBOUNCE_MS);
    },
    [selectedCliente, runSearch],
  );

  const onClienteSelect = useCallback(async (id: number) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    searchSeqRef.current++;
    setShowResults(false);
    setIsSearching(false);
    setIsLoadingCliente(true);
    try {
      const result = await getClienteAction(id);
      if (result.success && result.data) {
        setSelectedCliente(result.data);
        setClienteQuery(result.data.razao);
        setClienteResults([]);
      }
    } finally {
      setIsLoadingCliente(false);
    }
  }, []);

  const onSubmit = useCallback(async () => {
    if (!selectedIdemp || !selectedIdOper || !selectedCliente) return;

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const result = await criarPedidoAction({
        rctipo: "O",
        rcfat,
        idCli: selectedCliente.id,
        idOper: selectedIdOper,
        idemp: selectedIdemp,
      });

      if (result.success && result.data) {
        router.push(`/saler/orders/edit?id=${result.data.id}`);
      } else {
        setSubmitError(result.error || "Erro ao criar pedido");
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedIdemp, selectedIdOper, selectedCliente, rcfat, router]);

  const canSubmit = !!(selectedIdemp && selectedIdOper && selectedCliente && !isSubmitting);

  return {
    emitentes,
    isLoadingEmitentes,
    selectedIdemp,
    onIdemandChange,
    operacoes,
    isLoadingOperacoes,
    selectedIdOper,
    setSelectedIdOper,
    clienteQuery,
    onClienteQueryChange,
    clienteResults,
    isSearching,
    showResults,
    setShowResults,
    selectedCliente,
    isLoadingCliente,
    onClienteSelect,
    rcfat,
    setRcfat,
    isSubmitting,
    submitError,
    onSubmit,
    canSubmit,
    emitenteTriggerRef,
    operacaoTriggerRef,
    clienteInputRef,
  };
}
