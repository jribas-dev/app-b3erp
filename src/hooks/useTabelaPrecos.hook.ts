"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import {
  getTenantCfgAction,
  getClientesRedeSPAction,
  getTabelaPrecosAction,
} from "@/lib/vendas.service";
import type { ClienteRedeSP, ItemTabelaPrecos } from "@/types/vendas.types";

export function useTabelaPrecos() {
  const [idOper, setIdOper] = useState<number | null>(null);
  const [isLoadingInit, setIsLoadingInit] = useState(true);

  const [clientes, setClientes] = useState<ClienteRedeSP[]>([]);
  const [clienteQuery, setClienteQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<ClienteRedeSP | null>(null);

  const [tabela, setTabela] = useState<ItemTabelaPrecos[]>([]);
  const [isLoadingTabela, setIsLoadingTabela] = useState(false);
  const [tabelaError, setTabelaError] = useState<string | null>(null);

  const [filtro, setFiltro] = useState("");

  const clienteInputRef = useRef<HTMLInputElement>(null);
  const filtroInputRef = useRef<HTMLInputElement>(null);
  const initialFocusDoneRef = useRef(false);

  useEffect(() => {
    async function init() {
      setIsLoadingInit(true);
      try {
        // Sequencial e não Promise.all: o refresh-token é uso único com rotação,
        // duas server actions paralelas com token expirado disputam o mesmo refresh
        // e a perdedora retorna 401 — race que pode invalidar a sessão.
        const cfgResult = await getTenantCfgAction("VOPERPADRAO");
        if (cfgResult.success && cfgResult.data) {
          const n = Number(cfgResult.data.valor);
          if (Number.isFinite(n)) setIdOper(n);
        }
        const clientesResult = await getClientesRedeSPAction();
        if (clientesResult.success && clientesResult.data) {
          setClientes(clientesResult.data);
        }
      } finally {
        setIsLoadingInit(false);
      }
    }
    init();
  }, []);

  useEffect(() => {
    if (initialFocusDoneRef.current || isLoadingInit) return;
    clienteInputRef.current?.focus();
    initialFocusDoneRef.current = true;
  }, [isLoadingInit]);

  const filteredClientes = useMemo(() => {
    const q = clienteQuery.trim().toLowerCase();
    if (!q) return clientes;
    const digits = q.replace(/\D/g, "");
    return clientes.filter((c) => {
      if (c.nome.toLowerCase().includes(q)) return true;
      if (digits && c.docfed && c.docfed.replace(/\D/g, "").includes(digits)) return true;
      return false;
    });
  }, [clientes, clienteQuery]);

  const onClienteQueryChange = useCallback(
    (value: string) => {
      setClienteQuery(value);
      if (selectedCliente && value !== selectedCliente.nome) {
        setSelectedCliente(null);
        setTabela([]);
        setFiltro("");
        setTabelaError(null);
      }
      setShowDropdown(true);
    },
    [selectedCliente],
  );

  const onClienteSelect = useCallback(
    async (cliente: ClienteRedeSP) => {
      if (!idOper) return;
      setSelectedCliente(cliente);
      setClienteQuery(cliente.nome);
      setShowDropdown(false);
      setTabela([]);
      setFiltro("");
      setTabelaError(null);
      setIsLoadingTabela(true);
      try {
        const result = await getTabelaPrecosAction(idOper, cliente.id);
        if (result.success && result.data) {
          setTabela(result.data);
          setTimeout(() => filtroInputRef.current?.focus(), 100);
        } else {
          setTabelaError(result.error || "Erro ao carregar tabela de preços");
        }
      } finally {
        setIsLoadingTabela(false);
      }
    },
    [idOper],
  );

  const filteredTabela = useMemo(() => {
    const q = filtro.trim().toLowerCase();
    if (!q) return tabela;
    return tabela.filter(
      (item) =>
        item.nome.toLowerCase().includes(q) ||
        String(item.id).includes(q) ||
        (item.barras && item.barras.toLowerCase().includes(q)) ||
        (item.codigo && item.codigo.toLowerCase().includes(q)) ||
        (item.ref && item.ref.toLowerCase().includes(q)),
    );
  }, [tabela, filtro]);

  const cabecalho =
    tabela.length > 0
      ? { operacao: tabela[0].operacao, nometab: tabela[0].nometab, ufbase: tabela[0].ufbase }
      : null;

  return {
    idOper,
    isLoadingInit,
    clientes,
    clienteQuery,
    onClienteQueryChange,
    showDropdown,
    setShowDropdown,
    filteredClientes,
    selectedCliente,
    onClienteSelect,
    tabela,
    isLoadingTabela,
    tabelaError,
    filtro,
    setFiltro,
    filteredTabela,
    cabecalho,
    clienteInputRef,
    filtroInputRef,
  };
}
