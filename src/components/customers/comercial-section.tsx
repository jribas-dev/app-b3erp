"use client";

import { Controller, type UseFormReturn } from "react-hook-form";

import { Label } from "@/components/ui/label";
import { LoadingInput } from "@/components/ui/loading-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { ClienteFormValues } from "@/lib/forms/cliente-form.form";
import type {
  Emitente,
  MembroEquipe,
  Operacao,
} from "@/lib/vendas/schemas";

import { SectionTitle } from "./section-title";

interface ComercialSectionProps {
  form: UseFormReturn<ClienteFormValues>;
  isLoadingInit: boolean;
  isSupervisor: boolean;
  emitentes: Emitente[];
  selectedIdemp: number | null;
  onIdemandChange: (id: number) => void;
  operacoes: Operacao[];
  equipe: MembroEquipe[];
}

export function ComercialSection({
  form,
  isLoadingInit,
  isSupervisor,
  emitentes,
  selectedIdemp,
  onIdemandChange,
  operacoes,
  equipe,
}: ComercialSectionProps) {
  const { register, control } = form;

  return (
    <>
      <SectionTitle>Comercial</SectionTitle>

      {emitentes.length > 1 && (
        <div className="grid gap-1.5">
          <Label>Empresa (referência para operações)</Label>
          <Select
            value={selectedIdemp?.toString() ?? ""}
            onValueChange={(v) => onIdemandChange(Number(v))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a empresa" />
            </SelectTrigger>
            <SelectContent>
              {emitentes.map((e) => (
                <SelectItem key={e.id} value={e.id.toString()}>
                  {e.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label>Operação Fiscal Padrão</Label>
          {isLoadingInit ? (
            <LoadingInput />
          ) : (
            <Controller
              control={control}
              name="idoper"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar operação" />
                  </SelectTrigger>
                  <SelectContent>
                    {operacoes.map((o) => (
                      <SelectItem key={o.id} value={o.id.toString()}>
                        {o.operacao}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          )}
        </div>

        <div className="grid gap-1.5">
          <Label>Vendedor Responsável</Label>
          {isLoadingInit ? (
            <LoadingInput />
          ) : isSupervisor ? (
            <Controller
              control={control}
              name="idvende"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar vendedor" />
                  </SelectTrigger>
                  <SelectContent>
                    {equipe.map((m) => (
                      <SelectItem key={m.id} value={m.id.toString()}>
                        {m.razao}
                        {m.liderado === 0 ? " (você)" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          ) : (
            <div className="flex items-center gap-2 h-10 px-3 border rounded-(--radius) bg-muted/40">
              <span className="text-sm text-muted-foreground">
                {equipe.find((m) => m.liderado === 0)?.razao ?? "—"}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="obsvenda">Observação de Venda</Label>
        <Textarea
          id="obsvenda"
          maxLength={255}
          rows={3}
          placeholder="Observação exibida ao criar pedidos para este cliente"
          {...register("obsvenda")}
        />
      </div>
    </>
  );
}
