"use client";

import { Loader2, Plus } from "lucide-react";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import {
  Callout,
  CalloutDescription,
} from "@/components/ui/callout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { formatBRL } from "@/lib/format/currency";
import type {
  ImpostoCalculado,
  ProdutoBusca,
  ProdutoPreco,
} from "@/lib/vendas/schemas";

interface AdicionarProdutoProps {
  produtoQuery: string;
  onProdutoQueryChange: (v: string) => void;
  produtoResults: ProdutoBusca[];
  isSearching: boolean;
  showResults: boolean;
  setShowResults: (v: boolean) => void;
  selectedProduto: ProdutoBusca | null;
  onProdutoSelect: (p: ProdutoBusca) => void;
  preco: ProdutoPreco | null;
  isLoadingPreco: boolean;
  precoEdit: string;
  setPrecoEdit: (v: string) => void;
  qtde: string;
  setQtde: (v: string) => void;
  subtotal: number;
  impostos: ImpostoCalculado | null;
  isCalcImposto: boolean;
  isFiscal: boolean;
  canAddItem: boolean;
  isAddingItem: boolean;
  addError: string | null;
  onAdicionarItem: () => void;
}

export function AdicionarProduto(props: AdicionarProdutoProps) {
  const {
    produtoQuery,
    onProdutoQueryChange,
    produtoResults,
    isSearching,
    showResults,
    setShowResults,
    selectedProduto,
    onProdutoSelect,
    preco,
    isLoadingPreco,
    precoEdit,
    setPrecoEdit,
    qtde,
    setQtde,
    subtotal,
    impostos,
    isCalcImposto,
    isFiscal,
    canAddItem,
    isAddingItem,
    addError,
    onAdicionarItem,
  } = props;

  const produtoBuscaRef = useRef<HTMLInputElement | null>(null);
  const qtdeInputRef = useRef<HTMLInputElement | null>(null);
  const wasAddingRef = useRef(false);

  useEffect(() => {
    produtoBuscaRef.current?.focus();
  }, []);

  useEffect(() => {
    if (wasAddingRef.current && !isAddingItem) {
      produtoBuscaRef.current?.focus();
    }
    wasAddingRef.current = isAddingItem;
  }, [isAddingItem]);

  useEffect(() => {
    if (selectedProduto && preco && qtdeInputRef.current) {
      qtdeInputRef.current.focus();
      qtdeInputRef.current.select();
    }
  }, [selectedProduto, preco]);

  const totalItem = subtotal + (impostos?.st ?? 0) + (impostos?.ipi ?? 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Plus size={20} className="text-primary" />
          Adicionar Produto
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-1.5">
          <Label htmlFor="produto-busca">Produto</Label>
          <div className="relative">
            <div className="relative flex items-center">
              <Input
                id="produto-busca"
                ref={produtoBuscaRef}
                value={produtoQuery}
                onChange={(e) => onProdutoQueryChange(e.target.value)}
                onFocus={() => {
                  if (produtoResults.length > 0) setShowResults(true);
                }}
                placeholder="Nome, código ou descrição (mín. 2 caracteres)"
                autoComplete="off"
              />
              {(isSearching || isLoadingPreco) && (
                <div className="absolute right-3">
                  <Spinner size="sm" tone="muted" />
                </div>
              )}
            </div>

            {showResults && !isSearching && (
              <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-(--radius) shadow-lg overflow-hidden">
                {produtoResults.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-muted-foreground">
                    Nenhum produto encontrado
                  </div>
                ) : (
                  <ul className="max-h-56 overflow-y-auto divide-y divide-border">
                    {produtoResults.map((p) => (
                      <li key={p.id}>
                        <button
                          type="button"
                          className="w-full text-left px-4 py-2.5 hover:bg-muted/60 transition-colors grid grid-cols-[1fr_auto] gap-4 items-center"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            onProdutoSelect(p);
                          }}
                        >
                          <span className="text-sm font-medium truncate">
                            {p.nome}
                          </span>
                          <span className="text-xs font-mono text-muted-foreground shrink-0">
                            #{p.id}
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

        {selectedProduto && preco && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3 items-end">
              <div className="grid gap-1.5">
                <Label htmlFor="qtde">Quantidade</Label>
                <Input
                  id="qtde"
                  ref={qtdeInputRef}
                  type="number"
                  inputMode="decimal"
                  min="0.001"
                  step="0.001"
                  value={qtde}
                  onChange={(e) => setQtde(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && canAddItem) {
                      e.preventDefault();
                      onAdicionarItem();
                    }
                  }}
                  className="font-mono"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="preco-unit">Preço unit.</Label>
                <Input
                  id="preco-unit"
                  type="text"
                  inputMode="decimal"
                  value={precoEdit}
                  onChange={(e) => setPrecoEdit(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && canAddItem) {
                      e.preventDefault();
                      onAdicionarItem();
                    }
                  }}
                  className="font-mono"
                />
              </div>
            </div>

            <div className="rounded-(--radius) border border-border bg-muted/20 p-3 space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-mono">{formatBRL(subtotal)}</span>
              </div>

              {isFiscal ? (
                isCalcImposto ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Spinner size="sm" tone="muted" />
                    Calculando impostos…
                  </div>
                ) : impostos ? (
                  <>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">IPI</span>
                      <span className="font-mono">
                        {formatBRL(impostos.ipi)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">ICMS-ST</span>
                      <span className="font-mono">
                        {formatBRL(impostos.st)}
                      </span>
                    </div>
                  </>
                ) : null
              ) : (
                <div className="text-xs text-muted-foreground italic">
                  Estimativa — impostos não aplicáveis
                </div>
              )}

              <div className="pt-1.5 mt-1 border-t border-border flex items-center justify-between">
                <span className="text-sm font-semibold">Total do item</span>
                <span className="font-mono font-bold text-primary">
                  {formatBRL(totalItem)}
                </span>
              </div>

              {preco.cfop && (
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                  <span>CFOP</span>
                  <span className="font-mono">{preco.cfop}</span>
                </div>
              )}
            </div>

            {addError && (
              <Callout variant="destructive">
                <CalloutDescription>{addError}</CalloutDescription>
              </Callout>
            )}

            <Button
              className="w-full"
              disabled={!canAddItem}
              onClick={onAdicionarItem}
            >
              {isAddingItem ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" />
                  Adicionando…
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Adicionar ao Pedido
                </>
              )}
            </Button>
          </div>
        )}

        {selectedProduto && isLoadingPreco && !preco && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Spinner size="sm" tone="muted" />
            Carregando preço…
          </div>
        )}
      </CardContent>
    </Card>
  );
}
