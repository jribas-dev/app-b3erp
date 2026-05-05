"use client";

import { Loader2, MapPin } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

import { FieldError } from "@/components/form/field-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ClienteFormValues } from "@/lib/forms/cliente-form.form";

import { SectionTitle } from "./section-title";

interface EnderecoSectionProps {
  form: UseFormReturn<ClienteFormValues>;
  onCepChange: (v: string) => void;
  onCepBlur: () => void;
  isCepLoading: boolean;
}

export function EnderecoSection({
  form,
  onCepChange,
  onCepBlur,
  isCepLoading,
}: EnderecoSectionProps) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = form;

  return (
    <>
      <SectionTitle>Endereço</SectionTitle>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="grid gap-1.5">
          <Label htmlFor="cep">CEP</Label>
          <div className="relative">
            <Input
              id="cep"
              inputMode="numeric"
              value={watch("cepDisplay")}
              onChange={(e) => onCepChange(e.target.value)}
              onBlur={onCepBlur}
              maxLength={9}
              placeholder="00000-000"
            />
            {isCepLoading && (
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                <Loader2
                  size={14}
                  className="animate-spin text-muted-foreground"
                />
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="uf">UF</Label>
          <Input
            id="uf"
            value={watch("uf")}
            onChange={(e) =>
              setValue("uf", e.target.value.toUpperCase().slice(0, 2), {
                shouldValidate: true,
              })
            }
            maxLength={2}
            placeholder="SP"
            className="uppercase"
            aria-invalid={!!errors.uf}
            aria-describedby={errors.uf ? "uf-error" : undefined}
          />
          <FieldError id="uf-error">{errors.uf?.message}</FieldError>
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="nroend">Número</Label>
          <Input
            id="nroend"
            maxLength={10}
            placeholder="Nº"
            {...register("nroend")}
          />
        </div>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="endereco">
          <MapPin size={12} className="inline mr-1" />
          Logradouro
        </Label>
        <Input
          id="endereco"
          maxLength={120}
          placeholder="Rua, Av., Alameda…"
          {...register("endereco")}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="bairro">Bairro</Label>
          <Input
            id="bairro"
            maxLength={60}
            placeholder="Bairro"
            {...register("bairro")}
          />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="cidade">Cidade</Label>
          <Input
            id="cidade"
            maxLength={60}
            placeholder="Cidade"
            {...register("cidade")}
          />
        </div>
      </div>
    </>
  );
}
