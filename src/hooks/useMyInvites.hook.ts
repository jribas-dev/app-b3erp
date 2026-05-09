"use client";

import { useCallback, useEffect, useState } from "react";

import {
  listMyInvitesAction,
  regenerateInviteAction,
  resendInviteAction,
} from "@/lib/admin/user-pre.service";
import { toast } from "@/lib/toast";
import type { UserPre } from "@/types/user-pre";

interface UseMyInvitesReturn {
  invites: UserPre[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  resend: (email: string) => Promise<boolean>;
  regenerate: (email: string) => Promise<boolean>;
  pendingEmail: string | null;
}

export function useMyInvites(): UseMyInvitesReturn {
  const [invites, setInvites] = useState<UserPre[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  const fetchList = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const result = await listMyInvitesAction();
    if (result.success) {
      setInvites(result.data);
    } else {
      setError(result.error);
      setInvites([]);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const resend = useCallback(
    async (email: string) => {
      setPendingEmail(email);
      const result = await resendInviteAction(email);
      setPendingEmail(null);
      if (result.success) {
        toast.sucesso(`Convite reenviado para ${email}`);
        return true;
      }
      toast.erro(result.error);
      return false;
    },
    []
  );

  const regenerate = useCallback(
    async (email: string) => {
      setPendingEmail(email);
      const result = await regenerateInviteAction(email);
      if (result.success) {
        toast.sucesso(`Novo token gerado e reenviado para ${email}`);
        await fetchList();
        setPendingEmail(null);
        return true;
      }
      setPendingEmail(null);
      toast.erro(result.error);
      return false;
    },
    [fetchList]
  );

  return {
    invites,
    isLoading,
    error,
    refetch: fetchList,
    resend,
    regenerate,
    pendingEmail,
  };
}
