"use client";

import { Check, Loader2 } from "lucide-react";
import { Controller, type UseFormReturn } from "react-hook-form";

import { FieldError } from "@/components/form/field-error";
import { Button } from "@/components/ui/button";
import {
  Callout,
  CalloutDescription,
  CalloutTitle,
} from "@/components/ui/callout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import type { FechamentoFormValues } from "@/lib/forms/fechamento.form";
import type {
  CondicaoPagamento,
  FormaPagamento,
} from "@/lib/vendas/schemas";

interface FechamentoFormProps {
  form: UseFormReturn<FechamentoFormValues>;
  isAberto: boolean;
  isLoadingFormas: boolean;
  formas: FormaPagamento[];
  condicoes: CondicaoPagamento[];
  canFechar: boolean;
  isFechando: boolean;
  fecharError: string | null;
  onFechar: (e?: React.BaseSyntheticEvent) => Promise<void>;
}

export function FechamentoForm({
  form,
  isAberto,
  isLoadingFormas,
  formas,
  condicoes,
  canFechar,
  isFechando,
  fecharError,
  onFechar,
}: FechamentoFormProps) {
  const {
    control,
    register,
    watch,
    formState: { errors },
  } = form;
  const obsInterValue = watch("obsInter") ?? "";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Check size={20} className="text-primary" />
          Fechar Pedido
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isAberto && (
          <Callout variant="info">
            <CalloutDescription>
              Pedido já fechado. Os dados abaixo são somente leitura.
            </CalloutDescription>
          </Callout>
        )}

        <form onSubmit={onFechar} noValidate className="space-y-4">
          <div className="grid gap-1.5">
            <Label htmlFor="forma">Forma de pagamento</Label>
            {isLoadingFormas ? (
              <LoadingInput label="Carregando formas…" />
            ) : (
              <Controller
                control={control}
                name="idForma"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={!isAberto || formas.length === 0}
                  >
                    <SelectTrigger id="forma" className="w-full">
                      <SelectValue placeholder="Selecione a forma" />
                    </SelectTrigger>
                    <SelectContent>
                      {formas.map((f) => (
                        <SelectItem key={f.id} value={f.id.toString()}>
                          {f.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            )}
            <FieldError>{errors.idForma?.message}</FieldError>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="cond">Condição de pagamento</Label>
            {isLoadingFormas ? (
              <LoadingInput label="Carregando condições…" />
            ) : (
              <Controller
                control={control}
                name="idCond"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={!isAberto || condicoes.length === 0}
                  >
                    <SelectTrigger id="cond" className="w-full">
                      <SelectValue placeholder="Selecione a condição" />
                    </SelectTrigger>
                    <SelectContent>
                      {condicoes.map((c) => (
                        <SelectItem key={c.id} value={c.id.toString()}>
                          {c.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            )}
            <FieldError>{errors.idCond?.message}</FieldError>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="obs">Observação interna</Label>
            <Textarea
              id="obs"
              maxLength={255}
              placeholder="Anotação interna (opcional)"
              disabled={!isAberto}
              {...register("obsInter")}
            />
            <span className="text-xs text-muted-foreground text-right">
              {obsInterValue.length}/255
            </span>
          </div>

          {fecharError && (
            <Callout variant="destructive">
              <CalloutTitle>Erro ao fechar pedido</CalloutTitle>
              <CalloutDescription>{fecharError}</CalloutDescription>
            </Callout>
          )}

          <Button type="submit" className="w-full" disabled={!canFechar}>
            {isFechando ? (
              <>
                <Loader2 size={16} className="animate-spin mr-2" />
                Gravando…
              </>
            ) : (
              "Gravar Fechamento"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
