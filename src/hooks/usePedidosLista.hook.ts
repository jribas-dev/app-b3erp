"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { cfgApi, pedidosApi } from "@/lib/api";
import { useSelectedEmitente } from "@/components/selected-emitente-provider";
import type { Emitente, PedidoLista } from "@/types/vendas.types";

export function usePedidosLista() {
  const { selectedIdemp, setSelectedIdemp } = useSelectedEmitente();
  const [emitentes, setEmitentes] = useState<Emitente[]>([]);
  const [isLoadingEmitentes, setIsLoadingEmitentes] = useState(true);

  const [editaveis, setEditaveis] = useState<PedidoLista[]>([]);
  const [isLoadingEditaveis, setIsLoadingEditaveis] = useState(false);
  const [editaveisError, setEditaveisError] = useState<string | null>(null);

  const [fechados, setFechados] = useState<PedidoLista[]>([]);
  const [isLoadingFechados, setIsLoadingFechados] = useState(false);
  const [fechadosError, setFechadosError] = useState<string | null>(null);

  const [filtroCliente, setFiltroCliente] = useState("");

  const loadListas = useCallback(async (idemp: number) => {
    setIsLoadingEditaveis(true);
    setIsLoadingFechados(true);
    setEditaveisError(null);
    setFechadosError(null);
    setEditaveis([]);
    setFechados([]);

    const [resEdit, resFech] = await Promise.all([
      pedidosApi.listEditaveis(idemp),
      pedidosApi.listFechados(idemp),
    ]);

    if (resEdit.success) {
      setEditaveis([...resEdit.data].sort((a, b) => b.id - a.id));
    } else {
      setEditaveisError(resEdit.error ?? "Erro ao buscar pedidos em aberto");
    }
    setIsLoadingEditaveis(false);

    if (resFech.success) {
      setFechados([...resFech.data].sort((a, b) => b.id - a.id));
    } else {
      setFechadosError(resFech.error ?? "Erro ao buscar histórico");
    }
    setIsLoadingFechados(false);
  }, []);

  const loadEmitentes = useCallback(async () => {
    setIsLoadingEmitentes(true);
    try {
      const result = await cfgApi.getEmitentes();
      if (result.success && result.data) {
        setEmitentes(result.data);
        if (
          selectedIdemp != null &&
          result.data.some((e) => e.id === selectedIdemp)
        ) {
          loadListas(selectedIdemp);
        } else if (result.data.length === 1) {
          const id = result.data[0].id;
          await setSelectedIdemp(id);
          loadListas(id);
        }
      }
    } finally {
      setIsLoadingEmitentes(false);
    }
  }, [loadListas, selectedIdemp, setSelectedIdemp]);

  const initRef = useRef(false);
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    loadEmitentes();
  }, [loadEmitentes]);

  const onIdemandChange = useCallback(
    async (idemp: number) => {
      await setSelectedIdemp(idemp);
      setFiltroCliente("");
      loadListas(idemp);
    },
    [loadListas, setSelectedIdemp],
  );

  const filteredFechados = fechados.filter((p) =>
    filtroCliente.trim().length === 0
      ? true
      : p.razaoCliente.toLowerCase().includes(filtroCliente.toLowerCase()),
  );

  const refresh = useCallback(() => {
    if (selectedIdemp) loadListas(selectedIdemp);
  }, [selectedIdemp, loadListas]);

  return {
    emitentes,
    isLoadingEmitentes,
    selectedIdemp,
    onIdemandChange,
    editaveis,
    isLoadingEditaveis,
    editaveisError,
    fechados,
    filteredFechados,
    isLoadingFechados,
    fechadosError,
    filtroCliente,
    setFiltroCliente,
    refresh,
  };
}
