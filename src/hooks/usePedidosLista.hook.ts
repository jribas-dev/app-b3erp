"use client";

import { useState, useCallback, useEffect } from "react";
import {
  getEmitentesAction,
  getPedidosEditaveisAction,
  getPedidosFechadosAction,
} from "@/lib/vendas.service";
import type { Emitente, PedidoLista } from "@/types/vendas.types";

export function usePedidosLista() {
  const [emitentes, setEmitentes] = useState<Emitente[]>([]);
  const [isLoadingEmitentes, setIsLoadingEmitentes] = useState(true);
  const [selectedIdemp, setSelectedIdemp] = useState<number | null>(null);

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
      getPedidosEditaveisAction(idemp),
      getPedidosFechadosAction(idemp),
    ]);

    if (resEdit.success && resEdit.data) {
      setEditaveis([...resEdit.data].sort((a, b) => b.id - a.id));
    } else {
      setEditaveisError(resEdit.error ?? "Erro ao buscar pedidos em aberto");
    }
    setIsLoadingEditaveis(false);

    if (resFech.success && resFech.data) {
      setFechados([...resFech.data].sort((a, b) => b.id - a.id));
    } else {
      setFechadosError(resFech.error ?? "Erro ao buscar histórico");
    }
    setIsLoadingFechados(false);
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
          loadListas(id);
        }
      }
    } finally {
      setIsLoadingEmitentes(false);
    }
  }, [loadListas]);

  useEffect(() => {
    loadEmitentes();
  }, [loadEmitentes]);

  const onIdemandChange = useCallback(
    (idemp: number) => {
      setSelectedIdemp(idemp);
      setFiltroCliente("");
      loadListas(idemp);
    },
    [loadListas],
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
