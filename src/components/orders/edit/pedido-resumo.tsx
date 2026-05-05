"use client";

import {
  Building2,
  IdCard,
  LocateFixed,
  MapPin,
  Phone,
  Receipt,
  ShoppingCart,
  Truck,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { formatBRL } from "@/lib/format/currency";
import type { PedidoDetalhe } from "@/lib/vendas/schemas";

const formatNum = (v: number) =>
  new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(v);

interface PedidoResumoProps {
  pedido: PedidoDetalhe;
  isFiscal: boolean;
}

export function PedidoResumo({ pedido, isFiscal }: PedidoResumoProps) {
  const tipoFatLabel = isFiscal ? "Fiscal" : "Estimativa";

  return (
    <Card>
      <div className="flex items-center justify-between gap-3 px-4 pt-1">
        <div className="flex items-center gap-2 min-w-0">
          <ShoppingCart size={20} className="text-primary shrink-0" />
          <span className="text-lg font-semibold font-mono truncate">
            Pedido #{pedido.id}
          </span>
        </div>
        <span
          className={[
            "inline-flex items-center gap-1.5 rounded-[100px] px-3 py-1 text-xs font-semibold border",
            isFiscal
              ? "border-primary/30 bg-primary/10 text-primary"
              : "border-accent/30 bg-accent/10 text-accent",
          ].join(" ")}
        >
          {isFiscal ? <Receipt size={12} /> : <Truck size={12} />}
          {tipoFatLabel}
        </span>
      </div>

      <CardContent className="space-y-4">
        <div className="border border-border rounded-(--radius) overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/40 border-b border-border">
            <Building2 size={16} className="text-primary shrink-0" />
            <span className="font-semibold text-sm truncate">
              {pedido.razaoCliente}
            </span>
            <span className="ml-auto text-xs font-mono text-muted-foreground shrink-0">
              #{pedido.idcli}
            </span>
          </div>
          {pedido.cliente && (
            <div className="px-4 py-3 grid gap-2 text-sm">
              {pedido.cliente.fone && (
                <div className="flex text-muted-foreground justify-between">
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="shrink-0" />
                    <span className="font-bold">{pedido.cliente.fone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IdCard size={14} className="shrink-0" />
                    <span className="font-mono">
                      {pedido.cliente.docformatado}
                    </span>
                  </div>
                </div>
              )}
              {pedido.cliente.endereco && (
                <div className="flex items-start gap-2 text-muted-foreground">
                  <LocateFixed size={14} className="shrink-0 mt-0.5" />
                  <span>
                    {[
                      pedido.cliente.endereco,
                      pedido.cliente.nroend,
                      pedido.cliente.bairro,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                </div>
              )}
              {(pedido.cliente.cidade || pedido.cliente.uf) && (
                <div className="flex items-start gap-2 text-muted-foreground">
                  <MapPin size={14} className="shrink-0 mt-0.5" />
                  <span className="font-semibold">
                    {[pedido.cliente.cidade, pedido.cliente.uf]
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid gap-2 rounded-(--radius) border border-border bg-muted/20 p-4 md:w-2/3 ml-auto">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Produtos</span>
            <span className="font-mono">{formatBRL(pedido.vlrbruto)}</span>
          </div>
          {pedido.desconto > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Desconto</span>
              <span className="font-mono text-destructive">
                -{formatNum(pedido.desconto)}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total ST</span>
            <span className="font-mono">{formatNum(pedido.st)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total IPI</span>
            <span className="font-mono">{formatNum(pedido.ipi)}</span>
          </div>
          <div className="mt-1 pt-2 border-t border-border flex items-center justify-between">
            <span className="text-sm font-semibold">Total</span>
            <span className="font-mono text-lg font-bold text-primary">
              {formatBRL(pedido.vlrtotal)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
