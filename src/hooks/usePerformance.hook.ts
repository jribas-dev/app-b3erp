"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  getEmitentesAction,
  getEquipeAction,
  getVendasSemanaisAction,
  getVendasMensaisAction,
  getTopClientesAtivosAction,
  getClientesInativosAction,
} from "@/lib/vendas";
import { getSessionAction } from "@/lib/auth.service";
import { useSelectedEmitente } from "@/components/selected-emitente-provider";
import type {
  Emitente,
  MembroEquipe,
  MetricaChartResponse,
  ClienteInativo,
} from "@/types/vendas.types";

export type MetricaTab =
  | "vendas-semanais"
  | "vendas-mensais"
  | "top-clientes"
  | "clientes-inativos";

export type MetricaData = MetricaChartResponse | ClienteInativo[] | null;

const DELAY_MS = 1500;

export function usePerformance() {
  const { selectedIdemp, setSelectedIdemp } = useSelectedEmitente();

  const [isLoadingInit, setIsLoadingInit] = useState(true);
  const [isSupervisor, setIsSupervisor] = useState(false);

  const [emitentes, setEmitentes] = useState<Emitente[]>([]);

  const [equipe, setEquipe] = useState<MembroEquipe[]>([]);
  const [selfVendedor, setSelfVendedor] = useState<MembroEquipe | null>(null);
  const [selectedVendedor, setSelectedVendedor] = useState<MembroEquipe | null>(
    null,
  );
  const [isComboboxActive, setIsComboboxActive] = useState(false);

  const [joinTeam, setJoinTeam] = useState(false);

  const [activeTab, setActiveTab] = useState<MetricaTab>("vendas-semanais");

  const [isLoadingMetrica, setIsLoadingMetrica] = useState(false);
  const [metricaData, setMetricaData] = useState<MetricaData>(null);
  const [metricaError, setMetricaError] = useState<string | null>(null);

  const delayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initDoneRef = useRef(false);

  const fetchMetrica = useCallback(
    async (
      tab: MetricaTab,
      idemp: number,
      idvende: number,
      join: boolean,
    ) => {
      setMetricaData(null);
      setMetricaError(null);
      setIsLoadingMetrica(true);
      try {
        const query = { idemp, idvende, join };
        let result;
        if (tab === "vendas-semanais")
          result = await getVendasSemanaisAction(query);
        else if (tab === "vendas-mensais")
          result = await getVendasMensaisAction(query);
        else if (tab === "top-clientes")
          result = await getTopClientesAtivosAction(query);
        else result = await getClientesInativosAction(query);

        if (result.success) {
          setMetricaData(result.data as MetricaData);
        } else {
          setMetricaError(result.error || "Erro ao carregar dados");
        }
      } finally {
        setIsLoadingMetrica(false);
      }
    },
    [],
  );

  const scheduleMetrica = useCallback(
    (
      tab: MetricaTab,
      idemp: number | null,
      vendedor: MembroEquipe | null,
      self: MembroEquipe | null,
      join: boolean,
    ) => {
      if (delayTimerRef.current) clearTimeout(delayTimerRef.current);

      if (idemp == null) return;
      const idvende = join ? self?.id : vendedor?.id;
      if (!idvende) return;

      setIsLoadingMetrica(true);
      setMetricaData(null);
      setMetricaError(null);
      delayTimerRef.current = setTimeout(
        () => fetchMetrica(tab, idemp, idvende, join),
        DELAY_MS,
      );
    },
    [fetchMetrica],
  );

  useEffect(() => {
    if (initDoneRef.current) return;
    initDoneRef.current = true;

    async function init() {
      setIsLoadingInit(true);
      try {
        const [session, equipeResult, emitentesResult] = await Promise.all([
          getSessionAction(),
          getEquipeAction(),
          getEmitentesAction(),
        ]);

        const supervisor = session?.roleFront?.includes("supersaler") ?? false;
        setIsSupervisor(supervisor);

        let lista: MembroEquipe[] = [];
        let self: MembroEquipe | null = null;
        if (equipeResult.success && equipeResult.data.length > 0) {
          lista = equipeResult.data;
          self = lista.find((m) => m.liderado === 0) ?? lista[0];
          setEquipe(lista);
          setSelfVendedor(self);
          setSelectedVendedor(self);
        }

        let idemp = selectedIdemp;
        if (emitentesResult.success && emitentesResult.data) {
          setEmitentes(emitentesResult.data);
          const validSelected =
            idemp != null && emitentesResult.data.some((e) => e.id === idemp);
          if (!validSelected && emitentesResult.data.length === 1) {
            idemp = emitentesResult.data[0].id;
            await setSelectedIdemp(idemp);
          } else if (!validSelected) {
            idemp = null;
          }
        }

        scheduleMetrica("vendas-semanais", idemp, self, self, false);
      } finally {
        setIsLoadingInit(false);
      }
    }

    init();
  }, [selectedIdemp, setSelectedIdemp, scheduleMetrica]);

  useEffect(() => {
    return () => {
      if (delayTimerRef.current) clearTimeout(delayTimerRef.current);
    };
  }, []);

  const onTabChange = useCallback(
    (tab: MetricaTab) => {
      setActiveTab(tab);
      scheduleMetrica(
        tab,
        selectedIdemp,
        selectedVendedor,
        selfVendedor,
        joinTeam,
      );
    },
    [scheduleMetrica, selectedIdemp, selectedVendedor, selfVendedor, joinTeam],
  );

  const onVendedorSelect = useCallback(
    (vendedor: MembroEquipe) => {
      setSelectedVendedor(vendedor);
      setIsComboboxActive(false);
      scheduleMetrica(activeTab, selectedIdemp, vendedor, selfVendedor, false);
    },
    [activeTab, scheduleMetrica, selectedIdemp, selfVendedor],
  );

  const onIdempChange = useCallback(
    async (idemp: number) => {
      await setSelectedIdemp(idemp);
      scheduleMetrica(
        activeTab,
        idemp,
        selectedVendedor,
        selfVendedor,
        joinTeam,
      );
    },
    [
      activeTab,
      scheduleMetrica,
      selectedVendedor,
      selfVendedor,
      joinTeam,
      setSelectedIdemp,
    ],
  );

  const onJoinToggle = useCallback(
    (join: boolean) => {
      setJoinTeam(join);
      if (join) setIsComboboxActive(false);
      scheduleMetrica(
        activeTab,
        selectedIdemp,
        selectedVendedor,
        selfVendedor,
        join,
      );
    },
    [activeTab, scheduleMetrica, selectedIdemp, selectedVendedor, selfVendedor],
  );

  const onActivateCombobox = useCallback(() => setIsComboboxActive(true), []);
  const onCancelCombobox = useCallback(() => setIsComboboxActive(false), []);

  return {
    isLoadingInit,
    isSupervisor,
    emitentes,
    selectedIdemp,
    onIdempChange,
    equipe,
    selectedVendedor,
    isComboboxActive,
    onActivateCombobox,
    onCancelCombobox,
    onVendedorSelect,
    joinTeam,
    onJoinToggle,
    activeTab,
    onTabChange,
    isLoadingMetrica,
    metricaData,
    metricaError,
  };
}
