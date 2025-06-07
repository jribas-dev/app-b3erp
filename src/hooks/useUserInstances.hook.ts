"use client";

import { useState, useCallback } from "react";
import { getUserInstancesAction } from "@/lib/auth.service";
import { type UserInstanceList } from "@/types/user-instance-list";

interface UseUserInstancesReturn {
  instances: UserInstanceList[];
  isLoadingInstances: boolean;
  errorInstances: string | null;
  fetchUserInstances: (userId: string) => Promise<void>;
  refetch: (userId: string) => Promise<void>;
}

export function useUserInstances(): UseUserInstancesReturn {
  const [instances, setInstances] = useState<UserInstanceList[]>([]);
  const [isLoadingInstances, setIsLoading] = useState(false);
  const [errorInstances, setError] = useState<string | null>(null);

  const fetchUserInstances = useCallback(async (userId: string) => {
    if (!userId) {
      setError("ID do usuário é obrigatório");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const result = await getUserInstancesAction(userId);
      
      if (result.success && result.data) {
        const activeInstances = result.data.filter(instance => instance.isActive);
        setInstances(activeInstances);
      } else {
        setError(result.error || "Erro ao carregar instâncias");
        setInstances([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado");
      setInstances([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refetch = useCallback(async (userId: string) => {
    await fetchUserInstances(userId);
  }, [fetchUserInstances]);

  return {
    instances,
    isLoadingInstances,
    errorInstances,
    fetchUserInstances,
    refetch,
  };
}