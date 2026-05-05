"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { cfgApi } from "@/lib/api";
import type { Emitente, Operacao } from "@/lib/vendas/schemas";

interface UseEmitenteOperacaoArgs {
  selectedIdemp: number | null;
  setSelectedIdemp: (id: number) => Promise<void>;
  onEmitenteChanged?: () => void;
}

// Carrega emitentes + operações com auto-seleção:
// - emitente único → seleciona e carrega operações automaticamente
// - operação default vem do config VOPERPADRAO; fallback id=1
// `onEmitenteChanged` permite ao orquestrador limpar buscas/clientes quando
// o usuário troca de empresa.
export function useEmitenteOperacao({
  selectedIdemp,
  setSelectedIdemp,
  onEmitenteChanged,
}: UseEmitenteOperacaoArgs) {
  const [emitentes, setEmitentes] = useState<Emitente[]>([]);
  const [isLoadingEmitentes, setIsLoadingEmitentes] = useState(true);

  const [operacoes, setOperacoes] = useState<Operacao[]>([]);
  const [isLoadingOperacoes, setIsLoadingOperacoes] = useState(false);
  const [selectedIdOper, setSelectedIdOper] = useState<number | null>(null);

  const initRef = useRef(false);

  const loadOperacoes = useCallback(async (idemp: number) => {
    setIsLoadingOperacoes(true);
    setOperacoes([]);
    setSelectedIdOper(null);
    try {
      const result = await cfgApi.getOperacoes(idemp);
      if (result.success && result.data) {
        const lista = result.data;
        setOperacoes(lista);

        if (lista.length > 0) {
          const cfg = await cfgApi.getTenantCfg("VOPERPADRAO");
          const fromCfg =
            cfg.success && cfg.data ? Number(cfg.data.valor) : NaN;
          const defaultOp =
            Number.isFinite(fromCfg) && lista.some((op) => op.id === fromCfg)
              ? fromCfg
              : (lista.find((op) => op.id === 1)?.id ?? null);

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
      const result = await cfgApi.getEmitentes();
      if (result.success && result.data) {
        setEmitentes(result.data);
        if (
          selectedIdemp != null &&
          result.data.some((e) => e.id === selectedIdemp)
        ) {
          await loadOperacoes(selectedIdemp);
        } else if (result.data.length === 1) {
          const id = result.data[0].id;
          await setSelectedIdemp(id);
          await loadOperacoes(id);
        }
      }
    } finally {
      setIsLoadingEmitentes(false);
    }
  }, [loadOperacoes, selectedIdemp, setSelectedIdemp]);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    loadEmitentes();
  }, [loadEmitentes]);

  const onIdemandChange = useCallback(
    async (idemp: number) => {
      await setSelectedIdemp(idemp);
      onEmitenteChanged?.();
      loadOperacoes(idemp);
    },
    [loadOperacoes, setSelectedIdemp, onEmitenteChanged],
  );

  return {
    emitentes,
    isLoadingEmitentes,
    operacoes,
    isLoadingOperacoes,
    selectedIdOper,
    setSelectedIdOper,
    onIdemandChange,
  };
}
