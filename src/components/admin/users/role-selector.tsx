"use client";

import { FieldError } from "@/components/form/field-error";
import { Label } from "@/components/ui/label";
import {
  ROLE_BACK_OPTIONS,
  ROLE_FRONT_OPTIONS,
  type RoleBackValue,
  type RoleFrontValue,
} from "@/lib/forms/invite.form";

interface RoleSelectorProps {
  roleBack: RoleBackValue;
  roleFront: RoleFrontValue[];
  onRoleBackChange: (value: RoleBackValue) => void;
  onRoleFrontToggle: (value: RoleFrontValue) => void;
  disabled?: boolean;
  roleBackError?: string;
  roleFrontError?: string;
}

export function RoleSelector({
  roleBack,
  roleFront,
  onRoleBackChange,
  onRoleFrontToggle,
  disabled = false,
  roleBackError,
  roleFrontError,
}: RoleSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-1.5">
        <Label>
          Acesso BackOffice <span className="text-destructive">*</span>
        </Label>
        <div
          role="radiogroup"
          aria-label="Acesso BackOffice"
          aria-disabled={disabled}
          className="grid grid-cols-2 gap-1.5 sm:grid-cols-4"
        >
          {ROLE_BACK_OPTIONS.map(({ value, label }) => {
            const active = roleBack === value;
            return (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => !disabled && onRoleBackChange(value)}
                disabled={disabled}
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
        <FieldError>{roleBackError}</FieldError>
      </div>

      <div className="grid gap-1.5">
        <Label>
          Acesso Web App <span className="text-destructive">*</span>
        </Label>
        <p className="text-xs text-muted-foreground">
          Selecione uma ou mais funções (Vendedor e Gerente de Vendas não podem
          coexistir).
        </p>
        <div
          aria-disabled={disabled}
          className="grid grid-cols-2 gap-1.5 sm:grid-cols-3"
        >
          {ROLE_FRONT_OPTIONS.map(({ value, label }) => {
            const active = roleFront.includes(value);
            return (
              <button
                key={value}
                type="button"
                role="checkbox"
                aria-checked={active}
                onClick={() => !disabled && onRoleFrontToggle(value)}
                disabled={disabled}
                className={[
                  "rounded-(--radius) border px-2 py-2 text-sm font-medium transition-colors text-left disabled:cursor-not-allowed disabled:opacity-60",
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
        <FieldError>{roleFrontError}</FieldError>
      </div>
    </div>
  );
}
