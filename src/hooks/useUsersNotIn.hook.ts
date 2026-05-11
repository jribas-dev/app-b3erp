"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  createUserInstanceAction,
  listUsersNotInAction,
} from "@/lib/admin/tenant-users.service";
import { toast } from "@/lib/toast";
import type {
  CreateUserInstancePayload,
  TenantUserAccount,
} from "@/types/tenant-users";

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

interface UseUsersNotInReturn {
  users: TenantUserAccount[];
  filteredUsers: TenantUserAccount[];
  filtro: string;
  setFiltro: (value: string) => void;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  selectedUserId: string | null;
  selectUser: (userId: string | null) => void;
  isSubmitting: boolean;
  createBinding: (payload: CreateUserInstancePayload) => Promise<boolean>;
}

export function useUsersNotIn(enabled: boolean): UseUsersNotInReturn {
  const [users, setUsers] = useState<TenantUserAccount[]>([]);
  const [filtro, setFiltro] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchList = useCallback(async () => {
    if (!enabled) {
      setUsers([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    const result = await listUsersNotInAction();
    if (result.success) {
      const sorted = [...result.data].sort((a, b) =>
        a.name.localeCompare(b.name, "pt-BR", { sensitivity: "base" })
      );
      setUsers(sorted);
    } else {
      setUsers([]);
      setError(result.error);
    }
    setIsLoading(false);
  }, [enabled]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const filteredUsers = useMemo(() => {
    const q = normalize(filtro.trim());
    if (!q) return users;
    const digits = q.replace(/\D/g, "");
    return users.filter((u) => {
      if (normalize(u.name).includes(q)) return true;
      if (normalize(u.email).includes(q)) return true;
      const phoneDigits = u.phone.replace(/\D/g, "");
      if (digits && phoneDigits.includes(digits)) return true;
      return false;
    });
  }, [users, filtro]);

  const selectUser = useCallback((userId: string | null) => {
    setSelectedUserId((prev) => (prev === userId ? null : userId));
  }, []);

  const createBinding = useCallback(
    async (payload: CreateUserInstancePayload) => {
      setIsSubmitting(true);
      const result = await createUserInstanceAction(payload);
      setIsSubmitting(false);
      if (result.success) {
        toast.sucesso("Usuário vinculado à instância");
        setUsers((prev) => prev.filter((u) => u.userId !== payload.userId));
        setSelectedUserId(null);
        return true;
      }
      toast.erro(result.error);
      return false;
    },
    []
  );

  return {
    users,
    filteredUsers,
    filtro,
    setFiltro,
    isLoading,
    error,
    refetch: fetchList,
    selectedUserId,
    selectUser,
    isSubmitting,
    createBinding,
  };
}
