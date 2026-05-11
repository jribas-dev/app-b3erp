"use client";

import { Mail, Phone, Search, UserMinus, UserX, Users } from "lucide-react";
import { forwardRef, useImperativeHandle, useMemo, useState } from "react";

import { RoleSelector } from "@/components/admin/users/role-selector";
import { Button } from "@/components/ui/button";
import {
  Callout,
  CalloutDescription,
  CalloutTitle,
} from "@/components/ui/callout";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useTenantUsers } from "@/hooks/useTenantUsers.hook";
import {
  type RoleBackValue,
  type RoleFrontValue,
} from "@/lib/forms/invite.form";
import type { TenantUserRow } from "@/types/tenant-users";

export interface ManageUsersTabHandle {
  refetch: () => Promise<void>;
}

interface ManageUsersTabProps {
  dbId: string | null | undefined;
  currentUserId: string | null | undefined;
}

interface DraftState {
  roleback: RoleBackValue;
  rolefront: RoleFrontValue[];
  isActive: boolean;
}

function rowToDraft(row: TenantUserRow): DraftState {
  return {
    roleback: row.instance.roleback,
    rolefront: row.instance.rolefront,
    isActive: row.instance.isActive,
  };
}

function draftsEqual(a: DraftState, b: DraftState): boolean {
  if (a.roleback !== b.roleback) return false;
  if (a.isActive !== b.isActive) return false;
  if (a.rolefront.length !== b.rolefront.length) return false;
  const setA = new Set(a.rolefront);
  return b.rolefront.every((v) => setA.has(v));
}

function hasConflict(rolefront: RoleFrontValue[]): boolean {
  return rolefront.includes("saler") && rolefront.includes("supersaler");
}

export const ManageUsersTab = forwardRef<
  ManageUsersTabHandle,
  ManageUsersTabProps
>(function ManageUsersTab({ dbId, currentUserId }, ref) {
  const {
    rows,
    filteredRows,
    filtro,
    setFiltro,
    isLoading,
    error,
    refetch,
    selectedUserId,
    selectUser,
    pendingUserId,
    updateInstance,
    setAccountActive,
  } = useTenantUsers({ dbId });

  useImperativeHandle(ref, () => ({ refetch }), [refetch]);

  const [drafts, setDrafts] = useState<Record<number, DraftState>>({});

  const handleSelect = (row: TenantUserRow) => {
    selectUser(row.account.userId);
    setDrafts((prev) =>
      prev[row.instance.id] ? prev : { ...prev, [row.instance.id]: rowToDraft(row) }
    );
  };

  const updateDraft = (instanceId: number, patch: Partial<DraftState>) => {
    setDrafts((prev) => ({
      ...prev,
      [instanceId]: { ...prev[instanceId], ...patch },
    }));
  };

  const toggleRoleFrontDraft = (instanceId: number, value: RoleFrontValue) => {
    setDrafts((prev) => {
      const current = prev[instanceId];
      if (!current) return prev;
      const next = current.rolefront.includes(value)
        ? current.rolefront.filter((v) => v !== value)
        : [...current.rolefront, value];
      return { ...prev, [instanceId]: { ...current, rolefront: next } };
    });
  };

  const handleSave = async (row: TenantUserRow) => {
    const draft = drafts[row.instance.id];
    if (!draft) return;
    if (draft.rolefront.length === 0) return;
    if (hasConflict(draft.rolefront)) return;

    const ok = await updateInstance(row.instance.id, {
      roleback: draft.roleback,
      rolefront: draft.rolefront,
      isActive: draft.isActive,
    });
    if (ok) {
      setDrafts((prev) => {
        const { [row.instance.id]: _removed, ...rest } = prev;
        void _removed;
        return rest;
      });
      selectUser(null);
    }
  };

  const handleCancel = (instanceId: number) => {
    setDrafts((prev) => {
      const { [instanceId]: _removed, ...rest } = prev;
      void _removed;
      return rest;
    });
    selectUser(null);
  };

  const handleDeactivateGlobal = async (row: TenantUserRow) => {
    const confirmed = window.confirm(
      `Inativar ${row.account.name} no sistema? Todos os vínculos com instâncias serão desativados.`
    );
    if (!confirmed) return;
    await setAccountActive(row.account.userId, false);
  };

  const handleActivateGlobal = async (row: TenantUserRow) => {
    await setAccountActive(row.account.userId, true);
  };

  const counterLabel = useMemo(() => {
    const total = filteredRows.length;
    const word = total === 1 ? "usuário" : "usuários";
    return filtro.trim()
      ? `${total} ${word} encontrado${total !== 1 ? "s" : ""}`
      : `${total} ${word}`;
  }, [filteredRows.length, filtro]);

  if (!dbId) {
    return (
      <Callout variant="warning">
        <CalloutTitle>Sem instância selecionada</CalloutTitle>
        <CalloutDescription>
          Selecione uma instância no início para gerenciar usuários.
        </CalloutDescription>
      </Callout>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-10 text-muted-foreground">
        <Spinner size="md" tone="muted" />
        <span className="text-sm">Carregando usuários…</span>
      </div>
    );
  }

  if (error) {
    return (
      <Callout variant="destructive">
        <CalloutTitle>Erro ao carregar usuários</CalloutTitle>
        <CalloutDescription>{error}</CalloutDescription>
      </Callout>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground">
        <Users size={36} className="opacity-40" />
        <p className="text-sm">Nenhum usuário vinculado a esta instância.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        />
        <Input
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          placeholder="Filtrar por nome, e-mail ou telefone"
          className="pl-9"
        />
      </div>

      <p className="text-xs text-muted-foreground px-1">{counterLabel}</p>

      {filteredRows.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 gap-2 text-muted-foreground">
          <Users size={32} className="opacity-40" />
          <p className="text-sm">
            Nenhum usuário encontrado para &ldquo;{filtro}&rdquo;
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-border border border-border rounded-(--radius) overflow-hidden bg-card">
          {filteredRows.map((row) => {
            const isSelected = selectedUserId === row.account.userId;
            const isPending = pendingUserId === row.account.userId;
            const isSelf = currentUserId === row.account.userId;
            const draft = drafts[row.instance.id];
            const currentDraft = draft ?? rowToDraft(row);
            const dirty = draft ? !draftsEqual(draft, rowToDraft(row)) : false;
            const conflict = hasConflict(currentDraft.rolefront);
            const emptyRoles = currentDraft.rolefront.length === 0;
            const accountInactive = !row.account.isActive;

            return (
              <li key={row.instance.id}>
                <button
                  type="button"
                  onClick={() => handleSelect(row)}
                  className={[
                    "w-full text-left px-3 py-3 sm:px-4 transition-colors",
                    isSelected
                      ? "bg-primary/5"
                      : "hover:bg-muted/40",
                  ].join(" ")}
                  aria-expanded={isSelected}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold leading-snug">
                          {row.account.name}
                        </span>
                        {isSelf ? (
                          <span className="rounded-(--radius) border border-accent/30 bg-accent/10 px-1.5 py-0.5 text-[10px] font-medium text-accent">
                            você
                          </span>
                        ) : null}
                        {accountInactive ? (
                          <span className="rounded-(--radius) border border-destructive/30 bg-destructive/10 px-1.5 py-0.5 text-[10px] font-medium text-destructive">
                            inativo
                          </span>
                        ) : !row.instance.isActive ? (
                          <span className="rounded-(--radius) border border-warning/30 bg-warning/10 px-1.5 py-0.5 text-[10px] font-medium text-warning">
                            sem acesso à instância
                          </span>
                        ) : null}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1 break-all">
                          <Mail size={12} />
                          {row.account.email}
                        </span>
                        {row.account.phone ? (
                          <span className="inline-flex items-center gap-1">
                            <Phone size={12} />
                            {row.account.phone}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </button>

                {isSelected ? (
                  <div className="px-3 pb-4 sm:px-4 border-t border-border/60 bg-muted/20">
                    <div className="pt-4 space-y-4">
                      <RoleSelector
                        roleBack={currentDraft.roleback}
                        roleFront={currentDraft.rolefront}
                        onRoleBackChange={(v) =>
                          updateDraft(row.instance.id, { roleback: v })
                        }
                        onRoleFrontToggle={(v) =>
                          toggleRoleFrontDraft(row.instance.id, v)
                        }
                        disabled={isPending || accountInactive}
                        roleFrontError={
                          conflict
                            ? "Vendedor e Gerente de Vendas não podem coexistir"
                            : emptyRoles
                            ? "Selecione pelo menos uma função"
                            : undefined
                        }
                      />

                      <div className="rounded-(--radius) border border-border bg-card p-3 space-y-2">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Status na instância
                        </p>
                        <div className="grid grid-cols-2 gap-1.5">
                          {(
                            [
                              { value: true, label: "Ativo" },
                              { value: false, label: "Inativo" },
                            ] as const
                          ).map(({ value, label }) => {
                            const active = currentDraft.isActive === value;
                            return (
                              <button
                                key={String(value)}
                                type="button"
                                role="radio"
                                aria-checked={active}
                                disabled={isPending || accountInactive}
                                onClick={() =>
                                  updateDraft(row.instance.id, {
                                    isActive: value,
                                  })
                                }
                                className={[
                                  "rounded-(--radius) border px-2 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60",
                                  active
                                    ? "border-primary bg-primary/10 text-primary"
                                    : "border-border bg-card text-foreground hover:bg-muted/60",
                                ].join(" ")}
                              >
                                {label}
                              </button>
                            );
                          })}
                        </div>
                        {accountInactive ? (
                          <p className="text-xs text-destructive">
                            Conta inativa globalmente — reative o usuário antes
                            de configurar a instância.
                          </p>
                        ) : null}
                      </div>

                      <div className="flex flex-wrap gap-2 pt-1">
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => handleSave(row)}
                          disabled={
                            isPending ||
                            !dirty ||
                            conflict ||
                            emptyRoles ||
                            accountInactive
                          }
                          className="gap-1.5"
                        >
                          {isPending ? <Spinner size="sm" tone="muted" /> : null}
                          Salvar alterações
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancel(row.instance.id)}
                          disabled={isPending || !dirty}
                        >
                          Cancelar
                        </Button>

                        {accountInactive ? (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleActivateGlobal(row)}
                            disabled={isPending}
                            className="ml-auto gap-1.5"
                          >
                            Reativar usuário
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeactivateGlobal(row)}
                            disabled={isPending || isSelf}
                            className="ml-auto gap-1.5 border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
                            title={
                              isSelf
                                ? "Você não pode inativar a si mesmo"
                                : "Inativa o usuário em todas as instâncias"
                            }
                          >
                            <UserX size={14} />
                            Inativar no sistema
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}

      <p className="text-[11px] text-muted-foreground px-1 inline-flex items-center gap-1">
        <UserMinus size={11} /> Inativar no sistema desativa o usuário em todas
        as instâncias vinculadas.
      </p>
    </div>
  );
});
