"use client";

import { useCallback, useRef, useState } from "react";

import { customersApi } from "@/lib/api";
import type { ClienteBusca, ClienteDetalhe } from "@/lib/vendas/schemas";

const SEARCH_MIN_CHARS = 3;
const SEARCH_DEBOUNCE_MS = 300;

// Busca de cliente com debounce + sequence guard. Seleciona um cliente
// pelo id e carrega detalhes. `clearCliente()` permite ao orquestrador
// resetar a seleção (ex.: ao trocar de emitente).
export function useClienteSearch() {
  const [clienteQuery, setClienteQuery] = useState("");
  const [clienteResults, setClienteResults] = useState<ClienteBusca[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<ClienteDetalhe | null>(
    null,
  );
  const [isLoadingCliente, setIsLoadingCliente] = useState(false);

  const searchSeqRef = useRef(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runSearch = useCallback(async (q: string) => {
    const seq = ++searchSeqRef.current;
    setIsSearching(true);
    setShowResults(true);
    try {
      const result = await customersApi.search(q);
      if (seq !== searchSeqRef.current) return;
      setClienteResults(result.success && result.data ? result.data : []);
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
        searchSeqRef.current++;
        setIsSearching(false);
        setShowResults(false);
        setClienteResults([]);
        return;
      }

      debounceRef.current = setTimeout(
        () => runSearch(trimmed),
        SEARCH_DEBOUNCE_MS,
      );
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
      const result = await customersApi.getById(id);
      if (result.success && result.data) {
        setSelectedCliente(result.data);
        setClienteQuery(result.data.razao);
        setClienteResults([]);
      }
    } finally {
      setIsLoadingCliente(false);
    }
  }, []);

  const clearCliente = useCallback(() => {
    setSelectedCliente(null);
    setClienteQuery("");
    setClienteResults([]);
    setShowResults(false);
  }, []);

  return {
    clienteQuery,
    clienteResults,
    isSearching,
    showResults,
    setShowResults,
    selectedCliente,
    isLoadingCliente,
    onClienteQueryChange,
    onClienteSelect,
    clearCliente,
  };
}
