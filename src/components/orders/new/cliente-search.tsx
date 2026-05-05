"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import type { ClienteBusca } from "@/lib/vendas/schemas";

interface ClienteSearchProps {
  inputRef: React.Ref<HTMLInputElement>;
  query: string;
  onQueryChange: (v: string) => void;
  results: ClienteBusca[];
  isSearching: boolean;
  isLoadingCliente: boolean;
  showResults: boolean;
  setShowResults: (v: boolean) => void;
  selectedIdemp: number | null;
  onSelect: (id: number) => void;
}

export function ClienteSearch({
  inputRef,
  query,
  onQueryChange,
  results,
  isSearching,
  isLoadingCliente,
  showResults,
  setShowResults,
  selectedIdemp,
  onSelect,
}: ClienteSearchProps) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor="cliente-busca">Cliente</Label>
      <div className="relative">
        <div className="relative flex items-center">
          <Input
            id="cliente-busca"
            ref={inputRef}
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onFocus={() => {
              if (results.length > 0) setShowResults(true);
            }}
            placeholder="Nome, ID ou CNPJ/CPF do cliente (mín. 3 caracteres)"
            autoComplete="off"
            disabled={!selectedIdemp}
          />
          {(isSearching || isLoadingCliente) && (
            <div className="absolute right-3">
              <Spinner size="sm" tone="muted" />
            </div>
          )}
        </div>

        {showResults && !isSearching && (
          <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-(--radius) shadow-lg overflow-hidden">
            {results.length === 0 ? (
              <div className="px-4 py-3 text-sm text-muted-foreground">
                Nenhum cliente encontrado
              </div>
            ) : (
              <ul className="max-h-56 overflow-y-auto divide-y divide-border">
                {results.map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      className="w-full text-left px-4 py-2.5 hover:bg-muted/60 transition-colors grid grid-cols-[1fr_auto_auto] gap-4 items-center"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        onSelect(c.id);
                      }}
                    >
                      <span className="text-sm font-medium truncate">
                        {c.razao}
                      </span>
                      <span className="text-xs font-mono text-muted-foreground shrink-0">
                        #{c.id}
                      </span>
                      <span className="text-xs font-mono text-muted-foreground shrink-0 hidden sm:block">
                        {c.display.match(/\(([^)]+)\)/)?.[1] ?? "—"}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
