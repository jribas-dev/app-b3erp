"use client";

import { Controller, type UseFormReturn } from "react-hook-form";

import { FieldError } from "@/components/form/field-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ClienteFormValues } from "@/lib/forms/cliente-form.form";

import { SectionTitle } from "./section-title";

interface IdentificacaoSectionProps {
  form: UseFormReturn<ClienteFormValues>;
  onDocfedChange: (v: string) => void;
}

const TIPOS_PESSOA = [
  { value: "F", label: "Física" },
  { value: "J", label: "Jurídica" },
  { value: "E", label: "Estatal" },
  { value: "R", label: "Rural" },
];

export function IdentificacaoSection({
  form,
  onDocfedChange,
}: IdentificacaoSectionProps) {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = form;

  return (
    <>
      <SectionTitle>Identificação</SectionTitle>

      <div className="grid gap-1.5">
        <Label>Tipo de Pessoa</Label>
        <Controller
          control={control}
          name="tipopessoa"
          render={({ field }) => (
            <div
              role="radiogroup"
              aria-label="Tipo de Pessoa"
              className="grid grid-cols-4 gap-1.5"
            >
              {TIPOS_PESSOA.map(({ value, label }) => {
                const active = field.value === value;
                return (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => field.onChange(value)}
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
          )}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="razao">
            Razão Social / Nome <span className="text-destructive">*</span>
          </Label>
          <Input
            id="razao"
            maxLength={100}
            placeholder="Nome completo ou razão social"
            aria-invalid={!!errors.razao}
            aria-describedby={errors.razao ? "razao-error" : undefined}
            {...register("razao")}
          />
          <FieldError id="razao-error">{errors.razao?.message}</FieldError>
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="fantasia">Nome Fantasia</Label>
          <Input
            id="fantasia"
            maxLength={60}
            placeholder="Nome fantasia (opcional)"
            {...register("fantasia")}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="docfed">CNPJ / CPF</Label>
          <Input
            id="docfed"
            inputMode="numeric"
            value={watch("docfedDisplay")}
            onChange={(e) => onDocfedChange(e.target.value)}
            maxLength={18}
            placeholder="000.000.000-00 ou 00.000.000/0000-00"
            aria-invalid={!!errors.docfedDisplay}
            aria-describedby={
              errors.docfedDisplay ? "docfed-error" : undefined
            }
          />
          <FieldError id="docfed-error">
            {errors.docfedDisplay?.message}
          </FieldError>
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="docest">IE / Identidade</Label>
          <Input
            id="docest"
            maxLength={20}
            placeholder="IE (opcional)"
            {...register("docest")}
          />
        </div>
      </div>
    </>
  );
}
