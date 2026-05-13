"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getEmitentesAction } from "@/lib/vendas/cfg";
import { getDashGraphAction } from "@/lib/dash/dash.service";
import { useSelectedEmitente } from "@/components/selected-emitente-provider";
import type { Emitente } from "@/types/vendas.types";
import type { ChartDataDto, Dominio, Periodo } from "@/types/dash.types";

const STORAGE_KEY = "dash-graph-view";

const VALID_DOMINIOS: Dominio[] = ["faturamento", "financeiro", "estoque"];
const VALID_PERIODOS: Periodo[] = ["S", "M", "T"];

const DOMINIO_FIRST_METRICA: Record<Dominio, string> = {
  faturamento: "evolucao",
  financeiro: "receber-vs-pagar",
  estoque: "entradas-vs-saidas",
};

type StoredView = {
  dominio: Dominio;
  metrica: string;
  periodo: Periodo;
};

const DEFAULT_VIEW: StoredView = {
  dominio: "faturamento",
  metrica: "evolucao",
  periodo: "M",
};

function loadStoredView(): StoredView {
  if (typeof window === "undefined") return DEFAULT_VIEW;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_VIEW;
    const parsed = JSON.parse(raw) as Partial<StoredView>;
    if (
      parsed.dominio &&
      VALID_DOMINIOS.includes(parsed.dominio) &&
      typeof parsed.metrica === "string" &&
      parsed.metrica.length > 0 &&
      parsed.periodo &&
      VALID_PERIODOS.includes(parsed.periodo)
    ) {
      return {
        dominio: parsed.dominio,
        metrica: parsed.metrica,
        periodo: parsed.periodo,
      };
    }
  } catch {
    // ignore parse/storage errors and fall back to defaults
  }
  return DEFAULT_VIEW;
}

function persistView(v: StoredView) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(v));
  } catch {
    // storage quota / unavailable — silently skip persistence
  }
}

export function useDashGraph() {
  const { selectedIdemp, setSelectedIdemp } = useSelectedEmitente();
  const [emitentes, setEmitentes] = useState<Emitente[]>([]);
  const [isLoadingInit, setIsLoadingInit] = useState(true);

  const [view, setView] = useState<StoredView>(() => loadStoredView());

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

  useEffect(() => {
    persistView(view);
  }, [view]);

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
    if (selectedIdemp) {
      fetchChart(view.dominio, view.metrica, selectedIdemp, view.periodo);
    }
  }, [selectedIdemp, view, fetchChart]);

  function onDominioChange(d: Dominio) {
    setView((v) => ({ ...v, dominio: d, metrica: DOMINIO_FIRST_METRICA[d] }));
  }

  function onMetricaChange(m: string) {
    setView((v) => ({ ...v, metrica: m }));
  }

  function onPeriodoChange(p: Periodo) {
    setView((v) => ({ ...v, periodo: p }));
  }

  async function onIdempChange(id: number) {
    await setSelectedIdemp(id);
  }

  return {
    emitentes,
    selectedIdemp,
    onIdempChange,
    isLoadingInit,
    selectedDominio: view.dominio,
    onDominioChange,
    selectedMetrica: view.metrica,
    onMetricaChange,
    selectedPeriodo: view.periodo,
    onPeriodoChange,
    chartData,
    isLoadingChart,
    error,
  };
}
