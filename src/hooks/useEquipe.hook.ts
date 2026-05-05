"use client";

import { useState, useEffect, useCallback } from "react";
import { equipeApi } from "@/lib/api";
import { getSessionAction } from "@/lib/auth.service";
import type { MembroEquipe } from "@/types/vendas.types";

export function useEquipe() {
  const [isLoading, setIsLoading] = useState(true);
  const [isActing, setIsActing] = useState(false);
  const [supervisorNome, setSupervisorNome] = useState<string>("");
  const [isSupervisor, setIsSupervisor] = useState(false);
  const [membros, setMembros] = useState<MembroEquipe[]>([]);
  const [disponiveis, setDisponiveis] = useState<MembroEquipe[]>([]);
  const [selectedMembro, setSelectedMembro] = useState<MembroEquipe | null>(null);
  const [selectedDisponivel, setSelectedDisponivel] = useState<MembroEquipe | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setSelectedMembro(null);
    setSelectedDisponivel(null);

    try {
      const [session, equipeRes, semEquipeRes] = await Promise.all([
        getSessionAction(),
        equipeApi.list(),
        equipeApi.listAvailable(),
      ]);

      if (session) setIsSupervisor(session.roleFront?.includes("supersaler") ?? false);

      if (equipeRes.success) {
        const supervisor = equipeRes.data.find((m) => Number(m.liderado) === 0);
        setSupervisorNome(supervisor?.razao ?? "");
        setMembros(equipeRes.data.filter((m) => Number(m.liderado) === 1));
      } else {
        setError(equipeRes.error ?? "Erro ao carregar equipe");
      }

      if (semEquipeRes.success) {
        setDisponiveis(semEquipeRes.data);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const clearActionMsg = useCallback(() => {
    setTimeout(() => setActionMsg(null), 3000);
  }, []);

  const adicionarMembro = useCallback(async () => {
    if (!selectedDisponivel || isActing) return;
    setIsActing(true);
    setError(null);

    const res = await equipeApi.addMembro(selectedDisponivel.id);
    if (res.success) {
      setActionMsg(`${selectedDisponivel.razao} adicionado à equipe`);
      clearActionMsg();
      await loadData();
    } else {
      setError(res.error ?? "Erro ao adicionar membro");
    }
    setIsActing(false);
  }, [selectedDisponivel, isActing, loadData, clearActionMsg]);

  const removerMembro = useCallback(async () => {
    if (!selectedMembro || isActing) return;
    setIsActing(true);
    setError(null);

    const res = await equipeApi.removeMembro(selectedMembro.id);
    if (res.success) {
      setActionMsg(`${selectedMembro.razao} removido da equipe`);
      clearActionMsg();
      await loadData();
    } else {
      setError(res.error ?? "Erro ao remover membro");
    }
    setIsActing(false);
  }, [selectedMembro, isActing, loadData, clearActionMsg]);

  return {
    isLoading,
    isActing,
    isSupervisor,
    supervisorNome,
    membros,
    disponiveis,
    selectedMembro,
    selectedDisponivel,
    setSelectedMembro,
    setSelectedDisponivel,
    adicionarMembro,
    removerMembro,
    error,
    actionMsg,
  };
}
