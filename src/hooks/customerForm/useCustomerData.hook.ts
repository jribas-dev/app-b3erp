"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { UseFormReset } from "react-hook-form";

import { customersApi } from "@/lib/api";
import {
  EMPTY_CLIENTE_FORM,
  type ClienteFormValues,
} from "@/lib/forms/cliente-form.form";
import { maskCep, maskDocfed } from "@/lib/format/document";
import type { ClienteBusca } from "@/lib/vendas/schemas";

import type { CustomerMode } from "./customer-mode";

interface UseCustomerDataArgs {
  reset: UseFormReset<ClienteFormValues>;
  selfVendId: number | null;
  setMode: (mode: CustomerMode) => void;
  setClienteId: (id: number | null) => void;
  setSubmitError: (msg: string | null) => void;
  setSubmitSuccess: (ok: boolean) => void;
}

// Search dialog + carregamento do cliente para edição + criação de novo.
// Quando um cliente é selecionado, popula o form via `reset`.
export function useCustomerData({
  reset,
  selfVendId,
  setMode,
  setClienteId,
  setSubmitError,
  setSubmitSuccess,
}: UseCustomerDataArgs) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ClienteBusca[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingCliente, setIsLoadingCliente] = useState(false);

  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, []);

  const openSearch = useCallback(() => {
    setSearchQuery("");
    setSearchResults([]);
    setSearchOpen(true);
  }, []);

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
  }, []);

  const onSearchQueryChange = useCallback((q: string) => {
    setSearchQuery(q);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    if (q.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    searchTimerRef.current = setTimeout(async () => {
      const res = await customersApi.search(q);
      setSearchResults(res.success && res.data ? res.data : []);
      setIsSearching(false);
    }, 400);
  }, []);

  const onSelectFromSearch = useCallback(
    async (id: number) => {
      setSearchOpen(false);
      setIsLoadingCliente(true);
      setSubmitError(null);
      setSubmitSuccess(false);
      try {
        const res = await customersApi.getById(id);
        if (res.success) {
          const c = res.data;
          setClienteId(c.id);
          setMode("edit");
          const rawDocfed = c.docfed ?? "";
          reset({
            tipopessoa: c.tipopessoa ?? "F",
            razao: c.razao ?? "",
            fantasia: c.fantasia ?? "",
            docfedDisplay: rawDocfed ? maskDocfed(rawDocfed) : "",
            docest: c.docest ?? "",
            email: c.email ?? "",
            emailnfe: c.emailnfe ?? "",
            emailcob: c.emailcob ?? "",
            site: c.site ?? "",
            cepDisplay: c.cep ? maskCep(c.cep) : "",
            endereco: c.endereco ?? "",
            nroend: c.nroend ?? "",
            bairro: c.bairro ?? "",
            cidade: c.cidade ?? "",
            uf: c.uf ?? "",
            fone: c.fone ?? "",
            fone2: c.fone2 ?? "",
            cel: c.cel ?? "",
            obsvenda: c.obsvenda ?? "",
            idoper: c.idoper ? String(c.idoper) : "",
            idvende: c.idvende ? String(c.idvende) : "",
          });
        } else {
          setSubmitError(res.error || "Erro ao carregar cliente");
        }
      } finally {
        setIsLoadingCliente(false);
      }
    },
    [reset, setMode, setClienteId, setSubmitError, setSubmitSuccess],
  );

  const onNewCliente = useCallback(() => {
    setClienteId(null);
    setMode("new");
    setSubmitError(null);
    setSubmitSuccess(false);
    reset({
      ...EMPTY_CLIENTE_FORM,
      idvende: selfVendId ? String(selfVendId) : "",
    });
  }, [reset, selfVendId, setMode, setClienteId, setSubmitError, setSubmitSuccess]);

  return {
    searchOpen,
    searchQuery,
    searchResults,
    isSearching,
    isLoadingCliente,
    openSearch,
    closeSearch,
    onSearchQueryChange,
    onSelectFromSearch,
    onNewCliente,
  };
}
