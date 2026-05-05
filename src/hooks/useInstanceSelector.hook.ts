"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { logError } from "@/lib/observability/log";

import { useAuth } from "./useAuth.hook";
import { useSession } from "./useSession.hook";
import { useUserInstances } from "./useUserInstances.hook";

// Compose useSession + useUserInstances + useAuth into a single hook que cuida
// de auto-seleção (única instância), seleção manual (múltiplas), troca de
// instância já selecionada, e refetch após sucesso. Centraliza os 5+
// useState/useEffect que viviam em home/page.tsx.
export function useInstanceSelector() {
  const {
    session,
    isLoading: isSessionLoading,
    error: sessionError,
    refetch: refetchSession,
  } = useSession();
  const { selectInstance, logout, isPending } = useAuth();
  const { instances, isLoadingInstances, errorInstances, fetchUserInstances } =
    useUserInstances();

  const [instanceError, setInstanceError] = useState("");
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(
    null,
  );
  const [showInstanceSelector, setShowInstanceSelector] = useState(false);
  const [hasAutoSelected, setHasAutoSelected] = useState(false);
  const [hasLoadedInstances, setHasLoadedInstances] = useState(false);

  const isLoading = useMemo(
    () => isSessionLoading || isLoadingInstances,
    [isSessionLoading, isLoadingInstances],
  );

  const error = useMemo(
    () => sessionError || errorInstances,
    [sessionError, errorInstances],
  );

  // Carrega instâncias quando a sessão estiver disponível.
  useEffect(() => {
    if (session?.userId && !hasLoadedInstances && !isLoadingInstances) {
      setHasLoadedInstances(true);
      fetchUserInstances(session.userId);
    }
  }, [
    session?.userId,
    fetchUserInstances,
    hasLoadedInstances,
    isLoadingInstances,
  ]);

  // Mostra/esconde seletor com base em quantas instâncias e se já há uma ativa.
  useEffect(() => {
    if (instances.length > 1 && !session?.instanceName) {
      setShowInstanceSelector(true);
    } else if (session?.instanceName) {
      setShowInstanceSelector(false);
    }
  }, [instances.length, session?.instanceName]);

  // Após a seleção concluir, faz refetch para pegar a nova session com
  // instanceName preenchido.
  useEffect(() => {
    if (selectedInstanceId && !isPending) {
      const timer = setTimeout(() => {
        refetchSession();
        setSelectedInstanceId(null);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [selectedInstanceId, isPending, refetchSession]);

  const handleInstanceSelect = useCallback(
    async (instanceId: string) => {
      setInstanceError("");
      setSelectedInstanceId(instanceId);

      try {
        const result = await selectInstance(instanceId);
        if (!result.success && result.error) {
          if (
            result.error !== "NEXT_REDIRECT" &&
            !result.error.includes("NEXT_REDIRECT")
          ) {
            setInstanceError(result.error);
          }
          setSelectedInstanceId(null);
        }
      } catch (err) {
        logError("home.handleInstanceSelect", err, { instanceId });
        setInstanceError("Erro inesperado ao selecionar instância");
        setSelectedInstanceId(null);
      }
    },
    [selectInstance],
  );

  // Auto-seleção quando há exatamente uma instância disponível.
  useEffect(() => {
    if (
      instances.length === 1 &&
      !session?.instanceName &&
      !hasAutoSelected &&
      !isPending
    ) {
      setHasAutoSelected(true);
      handleInstanceSelect(instances[0].dbId);
    }
  }, [
    instances,
    session?.instanceName,
    hasAutoSelected,
    isPending,
    handleInstanceSelect,
  ]);

  const handleShowInstanceSelector = useCallback(() => {
    setShowInstanceSelector(true);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  const handleRetry = useCallback(() => {
    refetchSession();
    if (session?.userId) {
      fetchUserInstances(session.userId);
    }
  }, [refetchSession, session?.userId, fetchUserInstances]);

  return {
    session,
    isLoading,
    error,
    instances,
    hasLoadedInstances,
    isLoadingInstances,
    showInstanceSelector,
    selectedInstanceId,
    instanceError,
    isPending,
    handleInstanceSelect,
    handleShowInstanceSelector,
    handleLogout,
    handleRetry,
  };
}
