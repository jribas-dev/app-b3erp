"use client";

import { useImperativeHandle } from "react";

import { Callout } from "@/components/ui/callout";
import { Spinner } from "@/components/ui/spinner";
import { useMyInvites } from "@/hooks/useMyInvites.hook";

import { InviteItem } from "./invite-item";

export interface InvitesTabHandle {
  refetch: () => Promise<void>;
}

interface InvitesTabProps {
  refHandle?: React.RefObject<InvitesTabHandle | null>;
}

export function InvitesTab({ refHandle }: InvitesTabProps) {
  const { invites, isLoading, error, refetch, resend, regenerate, pendingEmail } =
    useMyInvites();

  useImperativeHandle(refHandle, () => ({ refetch }), [refetch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-10 text-muted-foreground">
        <Spinner size="md" tone="muted" />
        <span className="text-sm">Carregando convites…</span>
      </div>
    );
  }

  if (error) {
    return (
      <Callout variant="destructive">
        <p>Erro ao carregar convites: {error}</p>
      </Callout>
    );
  }

  if (invites.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-6 text-center">
        Nenhum convite enviado ainda.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-border border border-border rounded-(--radius) overflow-hidden bg-card">
      {invites.map((invite) => (
        <InviteItem
          key={invite.userPreId}
          invite={invite}
          isPending={pendingEmail === invite.email}
          onResend={resend}
          onRegenerate={regenerate}
        />
      ))}
    </ul>
  );
}
