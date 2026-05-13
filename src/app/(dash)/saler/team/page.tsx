"use client";

import { Users, UserPlus, UserMinus, Loader2, Phone } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Callout, CalloutTitle, CalloutDescription } from "@/components/ui/callout";
import { cn } from "@/lib/utils";
import { useEquipe } from "@/hooks/useEquipe.hook";
import type { MembroEquipe } from "@/types/vendas.types";

// ── listbox ───────────────────────────────────────────────────────────────────

function Listbox({
  items,
  selected,
  onSelect,
  emptyText,
  disabled,
}: {
  items: MembroEquipe[];
  selected: MembroEquipe | null;
  onSelect: (item: MembroEquipe) => void;
  emptyText: string;
  disabled?: boolean;
}) {
  return (
    <div className="border border-border rounded-(--radius) overflow-y-auto h-52 bg-background">
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground p-3 text-center">{emptyText}</p>
      ) : (
        items.map((item) => (
          <button
            key={item.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(item)}
            className={cn(
              "w-full text-left px-3 py-2.5 text-sm hover:bg-muted/50 transition-colors border-b border-border/40 last:border-b-0",
              selected?.id === item.id && "bg-primary/10 text-primary font-medium",
              disabled && "cursor-not-allowed opacity-50",
            )}
          >
            <span className="block leading-snug">{item.razao}</span>
            {(item.cel || item.fax) && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                <Phone size={10} className="shrink-0" />
                {item.cel ?? item.fax}
              </span>
            )}
          </button>
        ))
      )}
    </div>
  );
}

// ── page ──────────────────────────────────────────────────────────────────────

export default function TeamPage() {
  const {
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
  } = useEquipe();

  if (!isLoading && !isSupervisor) {
    return (
      <div className="container mx-auto max-w-xl px-3 py-4 space-y-4">
        <PageHeader icon={Users} title="Configurar Equipe" />
        <Callout variant="destructive">
          <CalloutTitle>Acesso negado</CalloutTitle>
          <CalloutDescription>Esta página é restrita ao perfil supervisor.</CalloutDescription>
        </Callout>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-3 py-4 space-y-5">
      <PageHeader icon={Users} title="Configurar Equipe" subtitle="Disponíveis são os vendedores sem equipe atribuída" />

      {/* Campo supervisor */}
      <div className="grid gap-1.5">
        <Label htmlFor="supervisor">Supervisor</Label>
        {isLoading ? (
          <div className="flex items-center gap-2 h-10 px-3 border rounded-(--radius) bg-muted/40">
            <Spinner size="sm" tone="muted" />
            <span className="text-sm text-muted-foreground">Carregando…</span>
          </div>
        ) : (
          <Input
            id="supervisor"
            value={supervisorNome}
            disabled
            className="bg-muted/40 cursor-not-allowed"
          />
        )}
      </div>

      {/* Bandejas */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Disponíveis */}
          <div className="space-y-2">
            <Label>
              Disponíveis para a equipe
              <span className="ml-1.5 text-xs text-muted-foreground font-normal">
                ({disponiveis.length})
              </span>
            </Label>
            <Listbox
              items={disponiveis}
              selected={selectedDisponivel}
              onSelect={(item) => {
                setSelectedDisponivel(item);
                setSelectedMembro(null);
              }}
              emptyText="Nenhum vendedor disponível"
              disabled={isActing}
            />
            <Button
              size="sm"
              className="w-full gap-2"
              disabled={!selectedDisponivel || isActing}
              onClick={adicionarMembro}
            >
              {isActing && !selectedMembro ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <UserPlus size={14} />
              )}
              Adicionar à equipe
            </Button>
          </div>

          {/* Membros */}
          <div className="space-y-2">
            <Label>
              Membros da equipe
              <span className="ml-1.5 text-xs text-muted-foreground font-normal">
                ({membros.length})
              </span>
            </Label>
            <Listbox
              items={membros}
              selected={selectedMembro}
              onSelect={(item) => {
                setSelectedMembro(item);
                setSelectedDisponivel(null);
              }}
              emptyText="Nenhum membro na equipe"
              disabled={isActing}
            />
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2"
              disabled={!selectedMembro || isActing}
              onClick={removerMembro}
            >
              {isActing && !selectedDisponivel ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <UserMinus size={14} />
              )}
              Retirar da equipe
            </Button>
          </div>
        </div>
      )}

      {/* Feedback */}
      {error && (
        <Callout variant="destructive">
          <CalloutTitle>Erro</CalloutTitle>
          <CalloutDescription>{error}</CalloutDescription>
        </Callout>
      )}
      {actionMsg && (
        <Callout variant="default">
          <CalloutDescription>{actionMsg}</CalloutDescription>
        </Callout>
      )}
    </div>
  );
}
