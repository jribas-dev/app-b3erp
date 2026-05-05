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
import type { Emitente } from "@/lib/vendas/schemas";

interface EmitenteSelectorProps {
  emitentes: Emitente[];
  isLoading: boolean;
  selectedIdemp: number | null;
  onChange: (id: number) => void;
  triggerRef: React.Ref<HTMLButtonElement>;
}

export function EmitenteSelector({
  emitentes,
  isLoading,
  selectedIdemp,
  onChange,
  triggerRef,
}: EmitenteSelectorProps) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor="emitente">Empresa Emitente</Label>
      {isLoading ? (
        <LoadingInput label="Carregando empresas…" />
      ) : (
        <Select
          value={selectedIdemp?.toString() ?? ""}
          onValueChange={(v) => onChange(Number(v))}
          disabled={emitentes.length === 1}
        >
          <SelectTrigger id="emitente" ref={triggerRef} className="w-full">
            <SelectValue placeholder="Selecione a empresa emitente" />
          </SelectTrigger>
          <SelectContent>
            {emitentes.map((e) => (
              <SelectItem key={e.id} value={e.id.toString()}>
                {e.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
