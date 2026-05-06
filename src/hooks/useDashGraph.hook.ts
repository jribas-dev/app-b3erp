"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getEmitentesAction } from "@/lib/vendas/cfg";
import { getDashGraphAction } from "@/lib/dash/dash.service";
import { useSelectedEmitente } from "@/components/selected-emitente-provider";
import type { Emitente } from "@/types/vendas.types";
import type { ChartDataDto, Dominio, Periodo } from "@/types/dash.types";

export function useDashGraph() {
  const { selectedIdemp, setSelectedIdemp } = useSelectedEmitente();
  const [emitentes, setEmitentes] = useState<Emitente[]>([]);
  const [isLoadingInit, setIsLoadingInit] = useState(true);

  const [selectedDominio, setSelectedDominio] = useState<Dominio>("faturamento");
  const [selectedMetrica, setSelectedMetrica] = useState<string | null>(null);
  const [selectedPeriodo, setSelectedPeriodo] = useState<Periodo | null>(null);

  const [chartData, setChartData] = useState<ChartDataDto | null>(null);
  const [isLoadingChart, setIsLoadingChart] = useState(false);
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
          // já está em selectedIdemp do contexto — useEffect dependente cuidará do fetch
        } else if (result.data.length === 1) {
          await setSelectedIdemp(result.data[0].id);
        }
      }
      setIsLoadingInit(false);
    }
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchChart = useCallback(
    async (dominio: Dominio, metrica: string, idemp: number, periodo: Periodo) => {
      setChartData(null);
      setError(null);
      setIsLoadingChart(true);
      try {
        const result = await getDashGraphAction(dominio, metrica, idemp, periodo);
        if (result.success) {
          setChartData(result.data);
        } else {
          setError(result.error ?? "Erro ao carregar dados");
        }
      } finally {
        setIsLoadingChart(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (selectedIdemp && selectedMetrica && selectedPeriodo) {
      fetchChart(selectedDominio, selectedMetrica, selectedIdemp, selectedPeriodo);
    }
  }, [selectedIdemp, selectedDominio, selectedMetrica, selectedPeriodo, fetchChart]);

  function onDominioChange(d: Dominio) {
    setSelectedDominio(d);
    setSelectedMetrica(null);
    setChartData(null);
    setError(null);
  }

  function onMetricaChange(m: string) {
    setSelectedMetrica(m);
    setChartData(null);
    setError(null);
  }

  function onPeriodoChange(p: Periodo) {
    setSelectedPeriodo(p);
  }

  async function onIdempChange(id: number) {
    await setSelectedIdemp(id);
    setChartData(null);
    setError(null);
  }

  return {
    emitentes,
    selectedIdemp,
    onIdempChange,
    isLoadingInit,
    selectedDominio,
    onDominioChange,
    selectedMetrica,
    onMetricaChange,
    selectedPeriodo,
    onPeriodoChange,
    chartData,
    isLoadingChart,
    error,
  };
}
