"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  getEquipeAction,
  getVendasSemanaisAction,
  getVendasMensaisAction,
  getTopClientesAtivosAction,
  getClientesInativosAction,
} from "@/lib/vendas";
import { getSessionAction } from "@/lib/auth.service";
import type { MembroEquipe, MetricaChartResponse, ClienteInativo } from "@/types/vendas.types";

export type MetricaTab = "vendas-semanais" | "vendas-mensais" | "top-clientes" | "clientes-inativos";
export type MetricaData = MetricaChartResponse | ClienteInativo[] | null;

const DELAY_MS = 1500;

export function usePerformance() {
  const [isLoadingInit, setIsLoadingInit] = useState(true);
  const [isSupervisor, setIsSupervisor] = useState(false);

  const [equipe, setEquipe] = useState<MembroEquipe[]>([]);
  const [selectedVendedor, setSelectedVendedor] = useState<MembroEquipe | null>(null);
  const [isComboboxActive, setIsComboboxActive] = useState(false);

  const [activeTab, setActiveTab] = useState<MetricaTab>("vendas-semanais");

  const [isLoadingMetrica, setIsLoadingMetrica] = useState(false);
  const [metricaData, setMetricaData] = useState<MetricaData>(null);
  const [metricaError, setMetricaError] = useState<string | null>(null);

  const delayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initDoneRef = useRef(false);

  const fetchMetrica = useCallback(async (tab: MetricaTab) => {
    setMetricaData(null);
    setMetricaError(null);
    setIsLoadingMetrica(true);
    try {
      let result;
      if (tab === "vendas-semanais") result = await getVendasSemanaisAction();
      else if (tab === "vendas-mensais") result = await getVendasMensaisAction();
      else if (tab === "top-clientes") result = await getTopClientesAtivosAction();
      else result = await getClientesInativosAction();

      if (result.success) {
        setMetricaData(result.data as MetricaData);
      } else {
        setMetricaError(result.error || "Erro ao carregar dados");
      }
    } finally {
      setIsLoadingMetrica(false);
    }
  }, []);

  const scheduleMetrica = useCallback(
    (tab: MetricaTab) => {
      if (delayTimerRef.current) clearTimeout(delayTimerRef.current);
      setIsLoadingMetrica(true);
      setMetricaData(null);
      setMetricaError(null);
      delayTimerRef.current = setTimeout(() => fetchMetrica(tab), DELAY_MS);
    },
    [fetchMetrica],
  );

  useEffect(() => {
    if (initDoneRef.current) return;
    initDoneRef.current = true;

    async function init() {
      setIsLoadingInit(true);
      try {
        const [session, equipeResult] = await Promise.all([
          getSessionAction(),
          getEquipeAction(),
        ]);
        if (session) {
          setIsSupervisor(session.roleFront?.includes("supersaler") ?? false);
        }
        if (equipeResult.success && equipeResult.data.length > 0) {
          setEquipe(equipeResult.data);
          setSelectedVendedor(equipeResult.data[0]);
        }
      } finally {
        setIsLoadingInit(false);
        scheduleMetrica("vendas-semanais");
      }
    }

    init();
  }, [scheduleMetrica]);

  useEffect(() => {
    return () => {
      if (delayTimerRef.current) clearTimeout(delayTimerRef.current);
    };
  }, []);

  const onTabChange = useCallback(
    (tab: MetricaTab) => {
      setActiveTab(tab);
      scheduleMetrica(tab);
    },
    [scheduleMetrica],
  );

  const onVendedorSelect = useCallback(
    (vendedor: MembroEquipe) => {
      setSelectedVendedor(vendedor);
      setIsComboboxActive(false);
      scheduleMetrica(activeTab);
    },
    [activeTab, scheduleMetrica],
  );

  const onActivateCombobox = useCallback(() => setIsComboboxActive(true), []);
  const onCancelCombobox = useCallback(() => setIsComboboxActive(false), []);

  return {
    isLoadingInit,
    isSupervisor,
    equipe,
    selectedVendedor,
    isComboboxActive,
    onActivateCombobox,
    onCancelCombobox,
    onVendedorSelect,
    activeTab,
    onTabChange,
    isLoadingMetrica,
    metricaData,
    metricaError,
  };
}
