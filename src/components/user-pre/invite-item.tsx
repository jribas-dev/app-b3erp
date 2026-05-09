"use client";

import { KeyRound, RotateCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import type { UserPre } from "@/types/user-pre";

interface InviteItemProps {
  invite: UserPre;
  isPending: boolean;
  onResend: (email: string) => void;
  onRegenerate: (email: string) => void;
}

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function InviteItem({
  invite,
  isPending,
  onResend,
  onRegenerate,
}: InviteItemProps) {
  const expires = new Date(invite.expiresAt);
  const isExpired = expires.getTime() < Date.now();

  return (
    <li className="py-3 px-3 sm:px-4">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium break-all leading-snug">
          {invite.email}
        </span>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-muted-foreground">
            Expira em {dateFormatter.format(expires)}
          </span>
          <span
            className={[
              "rounded-(--radius) border px-1.5 py-0.5 text-[11px] font-medium",
              isExpired
                ? "border-destructive/30 bg-destructive/10 text-destructive"
                : "border-success/30 bg-success/10 text-success",
            ].join(" ")}
          >
            {isExpired ? "Expirado" : "Ativo"}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onResend(invite.email)}
            disabled={isPending}
            className="gap-1.5"
          >
            {isPending ? (
              <Spinner size="sm" tone="muted" />
            ) : (
              <RotateCw size={14} />
            )}
            Reenviar
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onRegenerate(invite.email)}
            disabled={isPending || !isExpired}
            className="gap-1.5"
            title={
              isExpired
                ? "Gerar novo token e reenviar"
                : "Disponível somente após expiração"
            }
          >
            <KeyRound size={14} />
            Regenerar
          </Button>
        </div>
      </div>
    </li>
  );
}
