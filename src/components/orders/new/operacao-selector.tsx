"use client";

import { Label } from "@/components/ui/label";
import { LoadingInput } from "@/components/ui/loading-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Operacao } from "@/lib/vendas/schemas";

interface OperacaoSelectorProps {
  operacoes: Operacao[];
  isLoading: boolean;
  selectedIdemp: number | null;
  selectedIdOper: number | null;
  onChange: (id: number) => void;
  triggerRef: React.Ref<HTMLButtonElement>;
}

export function OperacaoSelector({
  operacoes,
  isLoading,
  selectedIdemp,
  selectedIdOper,
  onChange,
  triggerRef,
}: OperacaoSelectorProps) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor="operacao">Operação Fiscal</Label>
      {isLoading ? (
        <LoadingInput label="Carregando operações…" />
      ) : (
        <Select
          value={selectedIdOper?.toString() ?? ""}
          onValueChange={(v) => onChange(Number(v))}
          disabled={!selectedIdemp || operacoes.length === 0}
        >
          <SelectTrigger id="operacao" ref={triggerRef} className="w-full">
            <SelectValue
              placeholder={
                !selectedIdemp
                  ? "Selecione a empresa primeiro"
                  : "Selecione a operação fiscal"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {operacoes.map((op) => (
              <SelectItem key={op.id} value={op.id.toString()}>
                {op.operacao}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
