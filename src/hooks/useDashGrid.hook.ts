"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getEmitentesAction } from "@/lib/vendas/cfg";
import { getDashGridAction } from "@/lib/dash/dash.service";
import { useSelectedEmitente } from "@/components/selected-emitente-provider";
import type { Emitente } from "@/types/vendas.types";
import type { Dominio, GridResponseDto, Periodo } from "@/types/dash.types";

const LIMIT = 50;

export function useDashGrid() {
  const { selectedIdemp, setSelectedIdemp } = useSelectedEmitente();
  const [emitentes, setEmitentes] = useState<Emitente[]>([]);
  const [isLoadingInit, setIsLoadingInit] = useState(true);

  const [selectedDominio, setSelectedDominio] = useState<Dominio>("faturamento");
  const [selectedTipo, setSelectedTipo] = useState<string | null>(null);
  const [selectedPeriodo, setSelectedPeriodo] = useState<Periodo | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);

  const [page, setPage] = useState(1);
  const [gridData, setGridData] = useState<GridResponseDto<Record<string, unknown>> | null>(null);
  const [isLoadingGrid, setIsLoadingGrid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initRef = useRef(false);
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    async function init() {
      const result = await getEmitentesAction();
      if (result.success) {
        setEmitentes(result.data);
        const cookieIdemp = selectedIdemp;
        if (
          cookieIdemp != null &&
          result.data.some((e) => e.id === cookieIdemp)
        ) {
          // já está em selectedIdemp do contexto
        } else if (result.data.length === 1) {
          await setSelectedIdemp(result.data[0].id);
        }
      }
      setIsLoadingInit(false);
    }
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchGrid = useCallback(
    async (
      dominio: Dominio,
      tipo: string,
      idemp: number,
      periodo: Periodo,
      p: number,
      status: string | undefined,
    ) => {
      setGridData(null);
      setError(null);
      setIsLoadingGrid(true);
      try {
        const result = await getDashGridAction(dominio, tipo, idemp, periodo, p, LIMIT, status);
        if (result.success) {
          setGridData(result.data);
        } else {
          setError(result.error ?? "Erro ao carregar lista");
        }
      } finally {
        setIsLoadingGrid(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (selectedIdemp && selectedTipo && selectedPeriodo) {
      fetchGrid(selectedDominio, selectedTipo, selectedIdemp, selectedPeriodo, page, selectedStatus);
    }
  }, [selectedIdemp, selectedDominio, selectedTipo, selectedPeriodo, page, selectedStatus, fetchGrid]);

  function onDominioChange(d: Dominio) {
    setSelectedDominio(d);
    setSelectedTipo(null);
    setSelectedStatus(undefined);
    setPage(1);
    setGridData(null);
    setError(null);
  }

  function onTipoChange(t: string) {
    setSelectedTipo(t);
    setSelectedStatus(undefined);
    setPage(1);
    setGridData(null);
    setError(null);
  }

  function onPeriodoChange(p: Periodo) {
    setSelectedPeriodo(p);
    setPage(1);
  }

  function onStatusChange(s: string | undefined) {
    setSelectedStatus(s || undefined);
    setPage(1);
  }

  function onPageChange(p: number) {
    setPage(p);
  }

  async function onIdempChange(id: number) {
    await setSelectedIdemp(id);
    setGridData(null);
    setError(null);
  }

  return {
    emitentes,
    selectedIdemp,
    onIdempChange,
    isLoadingInit,
    selectedDominio,
    onDominioChange,
    selectedTipo,
    onTipoChange,
    selectedPeriodo,
    onPeriodoChange,
    selectedStatus,
    onStatusChange,
    page,
    onPageChange,
    gridData,
    isLoadingGrid,
    error,
    limit: LIMIT,
  };
}
