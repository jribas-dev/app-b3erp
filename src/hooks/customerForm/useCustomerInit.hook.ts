"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { UseFormSetValue } from "react-hook-form";

import { cfgApi, equipeApi } from "@/lib/api";
import { getSessionAction } from "@/lib/auth.service";
import type { ClienteFormValues } from "@/lib/forms/cliente-form.form";
import type {
  Emitente,
  MembroEquipe,
  Operacao,
} from "@/lib/vendas/schemas";

interface UseCustomerInitArgs {
  setValue: UseFormSetValue<ClienteFormValues>;
  selectedIdemp: number | null;
  setSelectedIdemp: (id: number) => Promise<void>;
}

// Carrega o contexto inicial do form (sessão, equipe, emitentes, operações)
// e expõe `onIdemandChange` para recarregar operações quando o emitente muda.
export function useCustomerInit({
  setValue,
  selectedIdemp,
  setSelectedIdemp,
}: UseCustomerInitArgs) {
  const [isSupervisor, setIsSupervisor] = useState(false);
  const [selfVendId, setSelfVendId] = useState<number | null>(null);
  const [equipe, setEquipe] = useState<MembroEquipe[]>([]);
  const [emitentes, setEmitentes] = useState<Emitente[]>([]);
  const [operacoes, setOperacoes] = useState<Operacao[]>([]);
  const [isLoadingInit, setIsLoadingInit] = useState(true);

  const initDoneRef = useRef(false);

  useEffect(() => {
    if (initDoneRef.current) return;
    initDoneRef.current = true;

    async function init() {
      setIsLoadingInit(true);
      try {
        const [session, equipeRes, emitentesRes] = await Promise.all([
          getSessionAction(),
          equipeApi.list(),
          cfgApi.getEmitentes(),
        ]);

        const isSup = session?.roleFront?.includes("supersaler") ?? false;
        setIsSupervisor(isSup);

        if (equipeRes.success) {
          setEquipe(equipeRes.data);
          const self = equipeRes.data.find((m) => m.liderado === 0);
          if (self) {
            setSelfVendId(self.id);
            if (!isSup) {
              setValue("idvende", String(self.id));
            }
          }
        }

        if (emitentesRes.success && emitentesRes.data.length > 0) {
          setEmitentes(emitentesRes.data);
          let activeId: number | null = null;
          if (
            selectedIdemp != null &&
            emitentesRes.data.some((e) => e.id === selectedIdemp)
          ) {
            activeId = selectedIdemp;
          } else if (emitentesRes.data.length === 1) {
            activeId = emitentesRes.data[0].id;
            await setSelectedIdemp(activeId);
          }

          if (activeId != null) {
            const opsRes = await cfgApi.getOperacoes(activeId);
            if (opsRes.success) {
              setOperacoes(opsRes.data);
            }
          }
        }
      } finally {
        setIsLoadingInit(false);
      }
    }

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setValue]);

  const onIdemandChange = useCallback(
    async (id: number) => {
      await setSelectedIdemp(id);
      const opsRes = await cfgApi.getOperacoes(id);
      if (opsRes.success && opsRes.data) {
        setOperacoes(opsRes.data);
        setValue("idoper", "");
      }
    },
    [setValue, setSelectedIdemp],
  );

  return {
    isSupervisor,
    selfVendId,
    equipe,
    emitentes,
    operacoes,
    isLoadingInit,
    onIdemandChange,
  };
}
