"use client";

import { Loader2, Search } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { ClienteBusca } from "@/lib/vendas/schemas";

interface SearchDialogProps {
  open: boolean;
  query: string;
  results: ClienteBusca[];
  isSearching: boolean;
  onQueryChange: (q: string) => void;
  onSelect: (id: number) => void;
  onClose: () => void;
}

export function SearchDialog({
  open,
  query,
  results,
  isSearching,
  onQueryChange,
  onSelect,
  onClose,
}: SearchDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md w-[calc(100vw-2rem)] p-0 gap-0">
        <DialogHeader className="px-4 pt-4 pb-3 border-b border-border">
          <DialogTitle className="flex items-center gap-2 text-base">
            <Search size={16} className="text-primary" />
            Buscar Cliente Existente
          </DialogTitle>
        </DialogHeader>

        <div className="px-4 pt-3 pb-2">
          <Input
            autoFocus
            placeholder="Nome, razão social ou CNPJ/CPF…"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
          />
          {query.length > 0 && query.length < 2 && (
            <p className="text-xs text-muted-foreground mt-1">
              Digite pelo menos 2 caracteres para pesquisar
            </p>
          )}
        </div>

        <div className="max-h-72 overflow-y-auto px-2 pb-3">
          {isSearching ? (
            <div className="flex items-center justify-center py-8 gap-2 text-muted-foreground">
              <Loader2 size={16} className="animate-spin" />
              <span className="text-sm">Pesquisando…</span>
            </div>
          ) : results.length === 0 && query.length >= 2 ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-sm text-muted-foreground">
                Nenhum cliente encontrado
              </p>
            </div>
          ) : (
            results.map((c) => (
              <button
                key={c.id}
                onClick={() => onSelect(c.id)}
                className="w-full text-left px-3 py-2.5 rounded-(--radius) hover:bg-muted/60 transition-colors"
              >
                <p className="text-sm font-medium leading-snug">{c.razao}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {c.display}
                </p>
              </button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
