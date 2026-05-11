"use client";

import { Mail, Phone, Search, UserPlus, Users } from "lucide-react";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";

import { RoleSelector } from "@/components/admin/users/role-selector";
import { Button } from "@/components/ui/button";
import {
  Callout,
  CalloutDescription,
  CalloutTitle,
} from "@/components/ui/callout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingInput } from "@/components/ui/loading-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useBackofficeUsers } from "@/hooks/useBackofficeUsers.hook";
import { useUsersNotIn } from "@/hooks/useUsersNotIn.hook";
import {
  TIPO_USUARIO_OPTIONS,
  type RoleBackValue,
  type RoleFrontValue,
  type TipoUsuarioValue,
} from "@/lib/forms/invite.form";
import { getEmitentesAction } from "@/lib/vendas/cfg";
import type { Emitente } from "@/lib/vendas/schemas";
import type { TenantUserAccount } from "@/types/tenant-users";

interface AddUserTabProps {
  dbId: string | null | undefined;
  onLinked?: () => void;
}

export interface AddUserTabHandle {
  refetch: () => Promise<void>;
}

interface DraftState {
  tipo: TipoUsuarioValue;
  roleBack: RoleBackValue;
  roleFront: RoleFrontValue[];
  idemp: number | null;
  idBackendUser: number | null;
}

const DEFAULT_ROLE_BACK: RoleBackValue = "notallow";
const DEFAULT_ROLE_FRONT: RoleFrontValue[] = ["notallow"];
const EXTERNO_ROLE_FRONT: RoleFrontValue[] = ["buyer"];

function defaultDraft(): DraftState {
  return {
    tipo: "interno",
    roleBack: DEFAULT_ROLE_BACK,
    roleFront: DEFAULT_ROLE_FRONT,
    idemp: null,
    idBackendUser: null,
  };
}

function hasConflict(rolefront: RoleFrontValue[]): boolean {
  return rolefront.includes("saler") && rolefront.includes("supersaler");
}

export const AddUserTab = forwardRef<AddUserTabHandle, AddUserTabProps>(
  function AddUserTab({ dbId, onLinked }, ref) {
    const {
      users,
      filteredUsers,
      filtro,
      setFiltro,
      isLoading,
      error,
      refetch,
      selectedUserId,
      selectUser,
      isSubmitting,
      createBinding,
    } = useUsersNotIn(Boolean(dbId));

    useImperativeHandle(ref, () => ({ refetch }), [refetch]);

    const [draft, setDraft] = useState<DraftState>(defaultDraft);

    const [emitentes, setEmitentes] = useState<Emitente[]>([]);
    const [isLoadingEmitentes, setIsLoadingEmitentes] = useState(false);
    const [emitentesError, setEmitentesError] = useState<string | null>(null);

    useEffect(() => {
      if (!selectedUserId) return;
      let cancelled = false;
      setIsLoadingEmitentes(true);
      setEmitentesError(null);
      getEmitentesAction().then((result) => {
        if (cancelled) return;
        if (result.success) {
          setEmitentes(result.data);
        } else {
          setEmitentes([]);
          setEmitentesError(result.error);
        }
        setIsLoadingEmitentes(false);
      });
      return () => {
        cancelled = true;
      };
    }, [selectedUserId]);

    const { users: backofficeUsers, isLoading: isLoadingBackoffice } =
      useBackofficeUsers(draft.idemp);

    const handleSelectUser = (user: TenantUserAccount) => {
      const wasSelected = selectedUserId === user.userId;
      selectUser(user.userId);
      if (!wasSelected) setDraft(defaultDraft());
    };

    const handleTipo = (value: TipoUsuarioValue) => {
      setDraft((d) =>
        value === "externo"
          ? {
              ...d,
              tipo: value,
              roleBack: "notallow",
              roleFront: EXTERNO_ROLE_FRONT,
            }
          : {
              ...d,
              tipo: value,
              roleBack: DEFAULT_ROLE_BACK,
              roleFront: DEFAULT_ROLE_FRONT,
            }
      );
    };

    const handleRoleBack = (value: RoleBackValue) => {
      if (draft.tipo === "externo") return;
      setDraft((d) => ({ ...d, roleBack: value }));
    };

    const toggleRoleFront = (value: RoleFrontValue) => {
      if (draft.tipo === "externo") return;
      setDraft((d) => {
        const next = d.roleFront.includes(value)
          ? d.roleFront.filter((v) => v !== value)
          : [...d.roleFront, value];
        return { ...d, roleFront: next };
      });
    };

    const handleIdempChange = (raw: string) => {
      const next = raw === "" ? null : Number(raw);
      setDraft((d) => ({ ...d, idemp: next, idBackendUser: null }));
    };

    const handleBackofficeChange = (raw: string) => {
      setDraft((d) => ({
        ...d,
        idBackendUser: raw === "" ? null : Number(raw),
      }));
    };

    const handleSubmit = async () => {
      if (!dbId || !selectedUserId) return;
      if (draft.roleFront.length === 0) return;
      if (hasConflict(draft.roleFront)) return;

      const ok = await createBinding({
        userId: selectedUserId,
        dbId,
        roleback: draft.roleBack,
        rolefront: draft.roleFront,
        ...(typeof draft.idBackendUser === "number"
          ? { idBackendUser: draft.idBackendUser }
          : {}),
      });
      if (ok) {
        setDraft(defaultDraft());
        onLinked?.();
      }
    };

    const counterLabel = useMemo(() => {
      const total = filteredUsers.length;
      const word = total === 1 ? "usuário" : "usuários";
      return filtro.trim()
        ? `${total} ${word} encontrado${total !== 1 ? "s" : ""}`
        : `${total} ${word}`;
    }, [filteredUsers.length, filtro]);

    const conflict = hasConflict(draft.roleFront);
    const emptyRoles = draft.roleFront.length === 0;
    const isExterno = draft.tipo === "externo";

    if (!dbId) {
      return (
        <Callout variant="warning">
          <CalloutTitle>Sem instância selecionada</CalloutTitle>
          <CalloutDescription>
            Selecione uma instância no início para incluir usuários.
          </CalloutDescription>
        </Callout>
      );
    }

    if (isLoading) {
      return (
        <div className="flex items-center justify-center gap-2 py-10 text-muted-foreground">
          <Spinner size="md" tone="muted" />
          <span className="text-sm">Carregando usuários disponíveis…</span>
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

    if (users.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground">
          <UserPlus size={36} className="opacity-40" />
          <p className="text-sm text-center max-w-sm">
            Não há usuários convidados por você sem vínculo nesta instância.
            Envie um novo convite para adicionar alguém.
          </p>
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

        {filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2 text-muted-foreground">
            <Users size={32} className="opacity-40" />
            <p className="text-sm">
              Nenhum usuário encontrado para &ldquo;{filtro}&rdquo;
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border border border-border rounded-(--radius) overflow-hidden bg-card">
            {filteredUsers.map((user) => {
              const isSelected = selectedUserId === user.userId;
              return (
                <li key={user.userId}>
                  <button
                    type="button"
                    onClick={() => handleSelectUser(user)}
                    className={[
                      "w-full text-left px-3 py-3 sm:px-4 transition-colors",
                      isSelected ? "bg-primary/5" : "hover:bg-muted/40",
                    ].join(" ")}
                    aria-expanded={isSelected}
                  >
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <span className="text-sm font-semibold leading-snug">
                        {user.name}
                      </span>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1 break-all">
                          <Mail size={12} />
                          {user.email}
                        </span>
                        {user.phone ? (
                          <span className="inline-flex items-center gap-1">
                            <Phone size={12} />
                            {user.phone}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </button>

                  {isSelected ? (
                    <div className="px-3 pb-4 sm:px-4 border-t border-border/60 bg-muted/20">
                      <div className="pt-4 space-y-4">
                        <div className="grid gap-1.5">
                          <Label>
                            Tipo de Usuário{" "}
                            <span className="text-destructive">*</span>
                          </Label>
                          <div
                            role="radiogroup"
                            aria-label="Tipo de Usuário"
                            className="grid grid-cols-2 gap-1.5"
                          >
                            {TIPO_USUARIO_OPTIONS.map(({ value, label }) => {
                              const active = draft.tipo === value;
                              return (
                                <button
                                  key={value}
                                  type="button"
                                  role="radio"
                                  aria-checked={active}
                                  onClick={() => handleTipo(value)}
                                  className={[
                                    "rounded-(--radius) border px-2 py-2 text-sm font-medium transition-colors",
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
                        </div>

                        <RoleSelector
                          roleBack={draft.roleBack}
                          roleFront={draft.roleFront}
                          onRoleBackChange={handleRoleBack}
                          onRoleFrontToggle={toggleRoleFront}
                          disabled={isExterno}
                          roleFrontError={
                            conflict
                              ? "Vendedor e Gerente de Vendas não podem coexistir"
                              : emptyRoles
                              ? "Selecione pelo menos uma função"
                              : undefined
                          }
                        />

                        <div className="grid gap-1.5">
                          <Label htmlFor={`empresa-${user.userId}`}>
                            Empresa{" "}
                            <span className="text-muted-foreground">
                              (opcional)
                            </span>
                          </Label>
                          {isLoadingEmitentes ? (
                            <LoadingInput label="Carregando empresas…" />
                          ) : emitentesError ? (
                            <p className="text-sm text-destructive">
                              {emitentesError}
                            </p>
                          ) : (
                            <Select
                              value={draft.idemp?.toString() ?? ""}
                              onValueChange={handleIdempChange}
                            >
                              <SelectTrigger
                                id={`empresa-${user.userId}`}
                                className="w-full"
                              >
                                <SelectValue placeholder="Selecione uma empresa" />
                              </SelectTrigger>
                              <SelectContent>
                                {emitentes.length === 0 ? (
                                  <div className="px-2 py-1.5 text-sm text-muted-foreground">
                                    Nenhuma empresa disponível
                                  </div>
                                ) : (
                                  emitentes.map((e) => (
                                    <SelectItem
                                      key={e.id}
                                      value={e.id.toString()}
                                    >
                                      {e.nome}
                                    </SelectItem>
                                  ))
                                )}
                              </SelectContent>
                            </Select>
                          )}
                        </div>

                        <div className="grid gap-1.5">
                          <Label htmlFor={`backoffice-${user.userId}`}>
                            Usuário do Back-Office{" "}
                            <span className="text-muted-foreground">
                              (opcional)
                            </span>
                          </Label>
                          {draft.idemp === null ? (
                            <div className="flex h-10 items-center rounded-(--radius) border border-dashed border-border bg-muted/30 px-3 text-sm text-muted-foreground">
                              Selecione uma empresa
                            </div>
                          ) : isLoadingBackoffice ? (
                            <LoadingInput label="Carregando usuários…" />
                          ) : (
                            <Select
                              value={draft.idBackendUser?.toString() ?? ""}
                              onValueChange={handleBackofficeChange}
                            >
                              <SelectTrigger
                                id={`backoffice-${user.userId}`}
                                className="w-full"
                              >
                                <SelectValue placeholder="Selecione um usuário" />
                              </SelectTrigger>
                              <SelectContent>
                                {backofficeUsers.length === 0 ? (
                                  <div className="px-2 py-1.5 text-sm text-muted-foreground">
                                    Nenhum usuário disponível
                                  </div>
                                ) : (
                                  backofficeUsers.map((u) => (
                                    <SelectItem
                                      key={u.id}
                                      value={u.id.toString()}
                                    >
                                      {u.login}
                                    </SelectItem>
                                  ))
                                )}
                              </SelectContent>
                            </Select>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2 pt-1">
                          <Button
                            type="button"
                            size="sm"
                            onClick={handleSubmit}
                            disabled={
                              isSubmitting || conflict || emptyRoles
                            }
                            className="gap-1.5"
                          >
                            {isSubmitting ? (
                              <Spinner size="sm" tone="muted" />
                            ) : (
                              <UserPlus size={14} />
                            )}
                            Vincular à instância
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => selectUser(null)}
                            disabled={isSubmitting}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  }
);
