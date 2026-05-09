"use client";

import { useCallback, useEffect, useState } from "react";

import { listBackofficeUsersAction } from "@/lib/admin/user-pre.service";
import type { BackofficeUser } from "@/types/user-pre";

interface UseBackofficeUsersReturn {
  users: BackofficeUser[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useBackofficeUsers(
  idemp: number | null
): UseBackofficeUsersReturn {
  const [users, setUsers] = useState<BackofficeUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchList = useCallback(async () => {
    if (idemp === null) {
      setUsers([]);
      setError(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    const result = await listBackofficeUsersAction(idemp);
    if (result.success) {
      setUsers(result.data);
    } else {
      setError(result.error);
      setUsers([]);
    }
    setIsLoading(false);
  }, [idemp]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return { users, isLoading, error, refetch: fetchList };
}
