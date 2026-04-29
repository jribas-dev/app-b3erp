"use client";

import { useState, useEffect, useCallback } from "react";
import { getEmitentesAction } from "@/lib/vendas/cfg.service";
import { getDashGraphAction } from "@/lib/dash/dash.service";
import type { Emitente } from "@/types/vendas.types";
import type { ChartDataDto, Dominio, Periodo } from "@/types/dash.types";

export function useDashGraph() {
  const [emitentes, setEmitentes] = useState<Emitente[]>([]);
  const [selectedIdemp, setSelectedIdemp] = useState<number | null>(null);
  const [isLoadingInit, setIsLoadingInit] = useState(true);

  const [selectedDominio, setSelectedDominio] = useState<Dominio>("faturamento");
  const [selectedMetrica, setSelectedMetrica] = useState<string | null>(null);
  const [selectedPeriodo, setSelectedPeriodo] = useState<Periodo | null>(null);

  const [chartData, setChartData] = useState<ChartDataDto | null>(null);
  const [isLoadingChart, setIsLoadingChart] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      const result = await getEmitentesAction();
      if (result.success) {
        setEmitentes(result.data);
        if (result.data.length === 1) {
          setSelectedIdemp(result.data[0].id);
        }
      }
      setIsLoadingInit(false);
    }
    init();
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

  function onIdempChange(id: number) {
    setSelectedIdemp(id);
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
