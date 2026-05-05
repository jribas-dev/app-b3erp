"use client";

import { AlertCircle, Loader2, Package, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatBRL } from "@/lib/format/currency";
import { formatQty } from "@/lib/format/number";
import type { PedidoItem } from "@/lib/vendas/schemas";

interface ItensListProps {
  itens: PedidoItem[];
  isAberto: boolean;
  removingSeq: number | null;
  onRemoverItem: (seq: number) => void;
}

export function ItensList({
  itens,
  isAberto,
  removingSeq,
  onRemoverItem,
}: ItensListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Package size={20} className="text-primary" />
          Itens do Pedido
          <span className="ml-auto text-sm font-normal text-muted-foreground">
            {itens.length} {itens.length === 1 ? "item" : "itens"}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {itens.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2 text-muted-foreground">
            <AlertCircle size={24} />
            <span className="text-sm">Nenhum item adicionado</span>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {itens.map((item) => {
              const impItem = (item.vIPI ?? 0) + (item.vST ?? 0);
              const totalLinha = item.total + impItem;
              return (
                <li key={item.seq} className="py-3">
                  <div className="flex items-start gap-2">
                    <span className="text-xs font-mono text-muted-foreground pt-0.5 w-12 shrink-0">
                      #{item.idprod}
                    </span>
                    <span className="text-sm font-medium flex-1 leading-snug">
                      {item.nomeProduto}
                    </span>
                    <div className="flex items-start gap-1 shrink-0">
                      <span className="font-mono text-sm font-semibold">
                        {formatBRL(totalLinha)}
                      </span>
                      {isAberto && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 -mt-0.5 text-muted-foreground hover:text-destructive"
                          disabled={removingSeq === item.seq}
                          onClick={() => onRemoverItem(item.seq)}
                          aria-label={`Remover ${item.nomeProduto}`}
                        >
                          {removingSeq === item.seq ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Trash2 size={14} />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1 pl-14 text-xs font-mono text-muted-foreground">
                    <span>
                      {formatQty(item.qtde)} × {formatBRL(item.unitario)}
                    </span>
                    {impItem > 0 && <span>imp. {formatBRL(impItem)}</span>}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
