"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  listTenantUsersAction,
  setUserActiveAction,
  updateUserInstanceAction,
} from "@/lib/admin/tenant-users.service";
import type {
  RoleBackValue,
  RoleFrontValue,
} from "@/lib/forms/invite.form";
import { toast } from "@/lib/toast";
import type {
  TenantUserRow,
  UpdateUserInstancePayload,
} from "@/types/tenant-users";

interface UseTenantUsersOptions {
  dbId: string | null | undefined;
}

interface UseTenantUsersReturn {
  rows: TenantUserRow[];
  filteredRows: TenantUserRow[];
  filtro: string;
  setFiltro: (value: string) => void;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  selectedUserId: string | null;
  selectUser: (userId: string | null) => void;
  pendingUserId: string | null;
  updateInstance: (
    instanceId: number,
    payload: UpdateUserInstancePayload
  ) => Promise<boolean>;
  setAccountActive: (userId: string, isActive: boolean) => Promise<boolean>;
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export function useTenantUsers({
  dbId,
}: UseTenantUsersOptions): UseTenantUsersReturn {
  const [rows, setRows] = useState<TenantUserRow[]>([]);
  const [filtro, setFiltro] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);

  const fetchList = useCallback(async () => {
    if (!dbId) {
      setRows([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    const result = await listTenantUsersAction(dbId);
    if (result.success) {
      setRows(result.data);
    } else {
      setRows([]);
      setError(result.error);
    }
    setIsLoading(false);
  }, [dbId]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const filteredRows = useMemo(() => {
    const q = normalize(filtro.trim());
    if (!q) return rows;
    const digits = q.replace(/\D/g, "");
    return rows.filter((row) => {
      const name = normalize(row.account.name);
      const email = normalize(row.account.email);
      const phoneDigits = row.account.phone.replace(/\D/g, "");
      if (name.includes(q)) return true;
      if (email.includes(q)) return true;
      if (digits && phoneDigits.includes(digits)) return true;
      return false;
    });
  }, [rows, filtro]);

  const selectUser = useCallback((userId: string | null) => {
    setSelectedUserId((prev) => (prev === userId ? null : userId));
  }, []);

  const updateInstance = useCallback(
    async (instanceId: number, payload: UpdateUserInstancePayload) => {
      const row = rows.find((r) => r.instance.id === instanceId);
      const userId = row?.account.userId ?? null;
      if (userId) setPendingUserId(userId);

      const result = await updateUserInstanceAction(instanceId, payload);
      if (result.success) {
        setRows((prev) =>
          prev.map((r) =>
            r.instance.id === instanceId
              ? {
                  ...r,
                  instance: {
                    ...r.instance,
                    roleback:
                      (payload.roleback as RoleBackValue | undefined) ??
                      r.instance.roleback,
                    rolefront:
                      (payload.rolefront as RoleFrontValue[] | undefined) ??
                      r.instance.rolefront,
                    isActive: payload.isActive ?? r.instance.isActive,
                  },
                }
              : r
          )
        );
        toast.sucesso("Vínculo atualizado");
        setPendingUserId(null);
        return true;
      }

      toast.erro(result.error);
      setPendingUserId(null);
      return false;
    },
    [rows]
  );

  const setAccountActive = useCallback(
    async (userId: string, isActive: boolean) => {
      setPendingUserId(userId);
      const result = await setUserActiveAction(userId, isActive);
      if (result.success) {
        setRows((prev) =>
          prev.map((r) =>
            r.account.userId === userId
              ? {
                  ...r,
                  account: { ...r.account, isActive },
                  instance: isActive
                    ? r.instance
                    : { ...r.instance, isActive: false },
                }
              : r
          )
        );
        toast.sucesso(
          isActive
            ? "Usuário ativado no sistema"
            : "Usuário inativado em todas as instâncias"
        );
        setPendingUserId(null);
        return true;
      }
      toast.erro(result.error);
      setPendingUserId(null);
      return false;
    },
    []
  );

  return {
    rows,
    filteredRows,
    filtro,
    setFiltro,
    isLoading,
    error,
    refetch: fetchList,
    selectedUserId,
    selectUser,
    pendingUserId,
    updateInstance,
    setAccountActive,
  };
}
