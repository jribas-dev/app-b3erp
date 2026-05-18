"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getEmitentesAction } from "@/lib/vendas/cfg";
import { getDashGridAction } from "@/lib/dash/dash.service";
import { useSelectedEmitente } from "@/components/selected-emitente-provider";
import type { Emitente } from "@/types/vendas.types";
import type { Dominio, GridResponseDto, Periodo } from "@/types/dash.types";

export const PAGE_SIZE_OPTIONS = [12, 25, 50, 100] as const;
export type PageSize = (typeof PAGE_SIZE_OPTIONS)[number];
const DEFAULT_PAGE_SIZE: PageSize = 25;

const STORAGE_KEY = "dash-grid-view";

const VALID_DOMINIOS: Dominio[] = ["faturamento", "financeiro", "estoque"];
const VALID_PERIODOS: Periodo[] = ["S", "M", "T"];

const DOMINIO_TIPOS: Record<Dominio, string[]> = {
  faturamento: ["por-cliente", "por-produto", "por-vendedor"],
  financeiro: ["receber", "pagar", "movimentos"],
  estoque: ["lancamentos", "por-produto", "por-fornecedor"],
};

const DOMINIO_FIRST_TIPO: Record<Dominio, string> = {
  faturamento: "por-cliente",
  financeiro: "receber",
  estoque: "lancamentos",
};

type StoredView = {
  dominio: Dominio;
  tipo: string;
  periodo: Periodo;
  limit: PageSize;
};

const DEFAULT_VIEW: StoredView = {
  dominio: "faturamento",
  tipo: "por-cliente",
  periodo: "S",
  limit: DEFAULT_PAGE_SIZE,
};

function isPageSize(v: unknown): v is PageSize {
  return typeof v === "number" && (PAGE_SIZE_OPTIONS as readonly number[]).includes(v);
}

function loadStoredView(): StoredView {
  if (typeof window === "undefined") return DEFAULT_VIEW;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_VIEW;
    const parsed = JSON.parse(raw) as Partial<StoredView>;
    if (
      parsed.dominio &&
      VALID_DOMINIOS.includes(parsed.dominio) &&
      typeof parsed.tipo === "string" &&
      DOMINIO_TIPOS[parsed.dominio]?.includes(parsed.tipo) &&
      parsed.periodo &&
      VALID_PERIODOS.includes(parsed.periodo)
    ) {
      return {
        dominio: parsed.dominio,
        tipo: parsed.tipo,
        periodo: parsed.periodo,
        limit: isPageSize(parsed.limit) ? parsed.limit : DEFAULT_PAGE_SIZE,
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

export function useDashGrid() {
  const { selectedIdemp, setSelectedIdemp } = useSelectedEmitente();
  const [emitentes, setEmitentes] = useState<Emitente[]>([]);
  const [isLoadingInit, setIsLoadingInit] = useState(true);

  const [view, setView] = useState<StoredView>(() => loadStoredView());
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

  const fetchGrid = useCallback(
    async (
      dominio: Dominio,
      tipo: string,
      idemp: number,
      periodo: Periodo,
      p: number,
      limit: PageSize,
      status: string | undefined,
    ) => {
      setGridData(null);
      setError(null);
      setIsLoadingGrid(true);
      try {
        const result = await getDashGridAction(dominio, tipo, idemp, periodo, p, limit, status);
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
    if (selectedIdemp) {
      fetchGrid(view.dominio, view.tipo, selectedIdemp, view.periodo, page, view.limit, selectedStatus);
    }
  }, [selectedIdemp, view, page, selectedStatus, fetchGrid]);

  function onDominioChange(d: Dominio) {
    setView((v) => ({ ...v, dominio: d, tipo: DOMINIO_FIRST_TIPO[d] }));
    setSelectedStatus(undefined);
    setPage(1);
  }

  function onTipoChange(t: string) {
    setView((v) => ({ ...v, tipo: t }));
    setSelectedStatus(undefined);
    setPage(1);
  }

  function onPeriodoChange(p: Periodo) {
    setView((v) => ({ ...v, periodo: p }));
    setPage(1);
  }

  function onStatusChange(s: string | undefined) {
    setSelectedStatus(s || undefined);
    setPage(1);
  }

  function onPageChange(p: number) {
    setPage(p);
  }

  function onLimitChange(l: PageSize) {
    setView((v) => ({ ...v, limit: l }));
    setPage(1);
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
    selectedDominio: view.dominio,
    onDominioChange,
    selectedTipo: view.tipo,
    onTipoChange,
    selectedPeriodo: view.periodo,
    onPeriodoChange,
    selectedStatus,
    onStatusChange,
    page,
    onPageChange,
    gridData,
    isLoadingGrid,
    error,
    limit: view.limit,
    onLimitChange,
  };
}
