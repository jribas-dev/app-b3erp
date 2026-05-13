"use client";

import { Send } from "lucide-react";
import { useEffect, useState } from "react";

import { RoleSelector } from "@/components/admin/users/role-selector";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { FieldError } from "@/components/form/field-error";
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
import { useCreateInvite } from "@/hooks/useCreateInvite.hook";
import { useSession } from "@/hooks/useSession.hook";
import {
  InviteFormSchema,
  TIPO_USUARIO_OPTIONS,
  type RoleBackValue,
  type RoleFrontValue,
  type TipoUsuarioValue,
} from "@/lib/forms/invite.form";
import { getEmitentesAction } from "@/lib/vendas/cfg";
import type { Emitente } from "@/lib/vendas/schemas";

interface CreateInviteTabProps {
  onCreated?: () => void;
}

interface FormErrors {
  email?: string;
  roleBack?: string;
  roleFront?: string;
  idBackendUser?: string;
}

const DEFAULT_ROLE_BACK: RoleBackValue = "user";
const EXTERNO_ROLE_BACK: RoleBackValue = "notallow";
const DEFAULT_ROLE_FRONT: RoleFrontValue[] = ["notallow"];
const EXTERNO_ROLE_FRONT: RoleFrontValue[] = ["buyer"];
const INTERNO_DISABLED_ROLE_BACK: readonly RoleBackValue[] = ["notallow"];

export function CreateInviteTab({ onCreated }: CreateInviteTabProps) {
  const { session, isLoading: isSessionLoading } = useSession();
  const { isSubmitting, submit } = useCreateInvite();

  const [tipo, setTipo] = useState<TipoUsuarioValue>("interno");
  const [roleBack, setRoleBack] = useState<RoleBackValue>(DEFAULT_ROLE_BACK);
  const [roleFront, setRoleFront] =
    useState<RoleFrontValue[]>(DEFAULT_ROLE_FRONT);
  const [idemp, setIdemp] = useState<number | null>(null);
  const [idBackendUser, setIdBackendUser] = useState<number | null>(null);
  const [email, setEmail] = useState("");

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [emitentes, setEmitentes] = useState<Emitente[]>([]);
  const [isLoadingEmitentes, setIsLoadingEmitentes] = useState(false);
  const [emitentesError, setEmitentesError] = useState<string | null>(null);

  const isExterno = tipo === "externo";

  // Carrega empresas da instância da sessão (sempre).
  useEffect(() => {
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
  }, []);

  const { users: backofficeUsers, isLoading: isLoadingBackoffice } =
    useBackofficeUsers(idemp);

  const handleTipoChange = (value: TipoUsuarioValue) => {
    setTipo(value);
    if (value === "externo") {
      setRoleBack(EXTERNO_ROLE_BACK);
      setRoleFront(EXTERNO_ROLE_FRONT);
      setIdemp(null);
      setIdBackendUser(null);
    } else {
      setRoleBack(DEFAULT_ROLE_BACK);
      setRoleFront(DEFAULT_ROLE_FRONT);
    }
    setErrors((prev) => ({
      ...prev,
      roleBack: undefined,
      roleFront: undefined,
      idBackendUser: undefined,
    }));
  };

  const handleRoleBack = (value: RoleBackValue) => {
    if (isExterno) return;
    setRoleBack(value);
    setErrors((prev) => ({
      ...prev,
      roleBack: undefined,
      idBackendUser: undefined,
    }));
  };

  const toggleRoleFront = (value: RoleFrontValue) => {
    if (isExterno) return;
    setRoleFront((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
    setErrors((prev) => ({ ...prev, roleFront: undefined }));
  };

  const handleIdempChange = (raw: string) => {
    setIdemp(raw === "" ? null : Number(raw));
    setIdBackendUser(null);
    setErrors((prev) => ({ ...prev, idBackendUser: undefined }));
  };

  const handleBackofficeChange = (raw: string) => {
    setIdBackendUser(raw === "" ? null : Number(raw));
    setErrors((prev) => ({ ...prev, idBackendUser: undefined }));
  };

  const handleEmailChange = (v: string) => {
    setEmail(v);
    setErrors((prev) => ({ ...prev, email: undefined }));
    setSubmitError(null);
  };

  const resetForm = () => {
    setTipo("interno");
    setRoleBack(DEFAULT_ROLE_BACK);
    setRoleFront(DEFAULT_ROLE_FRONT);
    setIdemp(null);
    setIdBackendUser(null);
    setEmail("");
    setErrors({});
    setSubmitError(null);
  };

  const handleSubmit = async () => {
    setSubmitError(null);
    if (!session?.dbId) {
      setSubmitError("Sessão sem instância ativa.");
      return;
    }
    const parsed = InviteFormSchema.safeParse({
      email,
      tipo,
      roleBack,
      roleFront,
      idemp: idemp ?? undefined,
      idBackendUser: idBackendUser ?? undefined,
    });
    if (!parsed.success) {
      const next: FormErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (
          key === "email" ||
          key === "roleBack" ||
          key === "roleFront" ||
          key === "idBackendUser"
        ) {
          next[key] = issue.message;
        }
      }
      setErrors(next);
      return;
    }
    const result = await submit({
      email: parsed.data.email,
      dbId: session.dbId,
      roleBack: parsed.data.roleBack,
      roleFront: parsed.data.roleFront,
      idBackendUser: parsed.data.idBackendUser,
    });
    if (result.success) {
      resetForm();
      onCreated?.();
    } else if (result.error) {
      setSubmitError(result.error);
    }
  };

  const requiresBackoffice = roleBack !== "notallow";
  const isSubmitDisabled =
    isSubmitting ||
    !session?.dbId ||
    email.trim() === "" ||
    roleBack === ("" as RoleBackValue) ||
    roleFront.length === 0 ||
    (requiresBackoffice && idBackendUser === null);

  if (isSessionLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-10 text-muted-foreground">
        <Spinner size="md" tone="muted" />
        <span className="text-sm">Carregando dados da sessão…</span>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {!session?.dbId ? (
        <Callout variant="warning">
          <p>Selecione uma instância no início para enviar convites.</p>
        </Callout>
      ) : null}

      <div className="space-y-4 rounded-(--radius) border border-border bg-card p-3 sm:p-4">
        <p className="text-sm font-semibold">Configuração de Acesso</p>

        <div className="grid gap-1.5">
          <Label>
            Tipo de Usuário <span className="text-destructive">*</span>
          </Label>
          <div
            role="radiogroup"
            aria-label="Tipo de Usuário"
            className="grid grid-cols-2 gap-1.5"
          >
            {TIPO_USUARIO_OPTIONS.map(({ value, label }) => {
              const active = tipo === value;
              return (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => handleTipoChange(value)}
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
          roleBack={roleBack}
          roleFront={roleFront}
          onRoleBackChange={handleRoleBack}
          onRoleFrontToggle={toggleRoleFront}
          disabled={isExterno}
          disabledRoleBack={isExterno ? undefined : INTERNO_DISABLED_ROLE_BACK}
          roleBackError={errors.roleBack}
          roleFrontError={errors.roleFront}
        />

        <div className="grid gap-1.5">
          <Label htmlFor="empresa">
            Empresa{" "}
            {requiresBackoffice ? (
              <span className="text-destructive">*</span>
            ) : (
              <span className="text-muted-foreground">(opcional)</span>
            )}
          </Label>
          {isLoadingEmitentes ? (
            <LoadingInput label="Carregando empresas…" />
          ) : emitentesError ? (
            <p className="text-sm text-destructive">{emitentesError}</p>
          ) : (
            <Select
              value={idemp?.toString() ?? ""}
              onValueChange={handleIdempChange}
            >
              <SelectTrigger id="empresa" className="w-full">
                <SelectValue placeholder="Selecione uma empresa" />
              </SelectTrigger>
              <SelectContent>
                {emitentes.length === 0 ? (
                  <div className="px-2 py-1.5 text-sm text-muted-foreground">
                    Nenhuma empresa disponível
                  </div>
                ) : (
                  emitentes.map((e) => (
                    <SelectItem key={e.id} value={e.id.toString()}>
                      {e.nome}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="backoffice">
            Usuário do Back-Office{" "}
            {requiresBackoffice ? (
              <span className="text-destructive">*</span>
            ) : (
              <span className="text-muted-foreground">(opcional)</span>
            )}
          </Label>
          {idemp === null ? (
            <div className="flex h-10 items-center rounded-(--radius) border border-dashed border-border bg-muted/30 px-3 text-sm text-muted-foreground">
              Selecione uma empresa
            </div>
          ) : isLoadingBackoffice ? (
            <LoadingInput label="Carregando usuários…" />
          ) : (
            <Select
              value={idBackendUser?.toString() ?? ""}
              onValueChange={handleBackofficeChange}
            >
              <SelectTrigger
                id="backoffice"
                className="w-full"
                aria-invalid={!!errors.idBackendUser}
                aria-describedby={
                  errors.idBackendUser ? "invite-backoffice-error" : undefined
                }
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
                    <SelectItem key={u.id} value={u.id.toString()}>
                      {u.login}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          )}
          <FieldError id="invite-backoffice-error">
            {errors.idBackendUser}
          </FieldError>
        </div>
      </div>

      <div className="space-y-3 rounded-(--radius) border border-border bg-card p-3 sm:p-4">
        <p className="text-sm font-semibold">Dados do Convidado</p>
        <div className="grid gap-1.5">
          <Label htmlFor="invite-email">
            E-mail <span className="text-destructive">*</span>
          </Label>
          <Input
            id="invite-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="convidado@empresa.com.br"
            value={email}
            onChange={(e) => handleEmailChange(e.target.value)}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "invite-email-error" : undefined}
          />
          <FieldError id="invite-email-error">{errors.email}</FieldError>
        </div>
      </div>

      {submitError ? (
        <Callout variant="destructive">
          <p>{submitError}</p>
        </Callout>
      ) : null}

      <Button
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitDisabled}
        className="w-full gap-2 sm:w-auto"
      >
        {isSubmitting ? (
          <Spinner size="sm" tone="muted" />
        ) : (
          <Send size={16} />
        )}
        Enviar convite
      </Button>
    </div>
  );
}
