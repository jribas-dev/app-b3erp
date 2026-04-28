"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Package,
  Phone,
  ShoppingCart,
} from "lucide-react";

import { getPedidoAction } from "@/lib/vendas";
import type { PedidoDetalhe } from "@/types/vendas.types";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Callout,
  CalloutDescription,
  CalloutTitle,
} from "@/components/ui/callout";

import { formatBRL } from "@/lib/format/currency";
import { formatDate } from "@/lib/format/date";
import { formatQty } from "@/lib/format/number";

const STATUS: Record<string, { label: string; className: string }> = {
  O: {
    label: "Rascunho",
    className: "border-primary/30 bg-primary/10 text-primary",
  },
  P: {
    label: "Pendente",
    className: "border-accent/30 bg-accent/10 text-accent",
  },
  V: {
    label: "Validado",
    className:
      "border-[oklch(0.625_0.177_140.4)]/30 bg-[oklch(0.625_0.177_140.4)]/10 text-[oklch(0.625_0.177_140.4)]",
  },
};

function StatusBadge({ tipo }: { tipo: string }) {
  const { label, className } = STATUS[tipo] ?? {
    label: tipo,
    className: "border-border bg-muted text-muted-foreground",
  };
  return (
    <span
      className={`inline-flex items-center rounded-[100px] border px-3 py-1 text-xs font-semibold ${className}`}
    >
      {label}
    </span>
  );
}

function ViewOrderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idRaw = searchParams.get("id");
  const idNumber = idRaw ? Number(idRaw) : NaN;
  const idPedido =
    Number.isFinite(idNumber) && idNumber > 0 ? idNumber : null;

  const [pedido, setPedido] = useState<PedidoDetalhe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!idPedido) {
      setLoadError("ID do pedido inválido.");
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    getPedidoAction(idPedido).then((result) => {
      if (cancelled) return;
      if (result.success) {
        setPedido(result.data);
      } else {
        setLoadError(result.error ?? "Erro ao carregar pedido.");
      }
      setIsLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [idPedido]);

  const goBack = () => router.push("/saler/orders/find#history");

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-xl px-3 py-4">
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (loadError || !pedido) {
    return (
      <div className="container mx-auto max-w-xl px-3 py-4 space-y-4">
        <Button variant="outline" size="sm" onClick={goBack} className="gap-2">
          <ArrowLeft size={16} />
          Voltar
        </Button>
        <Callout variant="destructive">
          <CalloutTitle>Não foi possível carregar o pedido</CalloutTitle>
          <CalloutDescription>
            {loadError ?? "Pedido não encontrado."}
          </CalloutDescription>
        </Callout>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-xl px-3 py-4 space-y-4">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between gap-2">
        <Button variant="outline" size="sm" onClick={goBack} className="gap-2">
          <ArrowLeft size={16} />
          Voltar
        </Button>
        <span className="font-mono text-xs text-muted-foreground">
          #{pedido.id}
        </span>
      </div>

      {/* Card principal */}
      <Card>
        <div className="flex items-center justify-between gap-3 px-4 pt-3 pb-1">
          <div className="flex items-center gap-2 min-w-0">
            <ShoppingCart size={20} className="shrink-0 text-primary" />
            <span className="truncate font-mono text-lg font-semibold">
              Pedido #{pedido.id}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {pedido.dthremissao && (
              <span className="font-mono text-xs text-muted-foreground">
                {formatDate(pedido.dthremissao)}
              </span>
            )}
            <StatusBadge tipo={pedido.tipo} />
          </div>
        </div>

        <CardContent className="space-y-4 pt-3">
          {/* Cliente */}
          <div className="overflow-hidden rounded-(--radius) border border-border">
            <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-4 py-2.5">
              <Building2 size={16} className="shrink-0 text-primary" />
              <span className="truncate text-sm font-semibold">
                {pedido.razaoCliente}
              </span>
              <span className="ml-auto shrink-0 font-mono text-xs text-muted-foreground">
                #{pedido.idcli}
              </span>
            </div>
            {pedido.cliente && (
              <div className="grid gap-2 px-4 py-3 text-sm">
                {pedido.cliente.fone && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone size={14} className="shrink-0" />
                    <span>{pedido.cliente.fone}</span>
                  </div>
                )}
                {(pedido.cliente.endereco ||
                  pedido.cliente.cidade ||
                  pedido.cliente.uf) && (
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <MapPin size={14} className="mt-0.5 shrink-0" />
                    <span>
                      {[
                        pedido.cliente.endereco,
                        pedido.cliente.nroend,
                        pedido.cliente.bairro,
                        pedido.cliente.cidade,
                        pedido.cliente.uf,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Totais */}
          <div className="grid gap-2 rounded-(--radius) border border-border bg-muted/20 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Valor bruto</span>
              <span className="font-mono">{formatBRL(pedido.vlrbruto)}</span>
            </div>
            {pedido.desconto > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Desconto</span>
                <span className="font-mono text-destructive">
                  -{formatBRL(pedido.desconto)}
                </span>
              </div>
            )}
            {pedido.acrescimo > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Acréscimo</span>
                <span className="font-mono">+{formatBRL(pedido.acrescimo)}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">ICMS-ST</span>
              <span className="font-mono">{formatBRL(pedido.st)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">IPI</span>
              <span className="font-mono">{formatBRL(pedido.ipi)}</span>
            </div>
            <div className="mt-1 flex items-center justify-between border-t border-border pt-2">
              <span className="text-sm font-semibold">Total</span>
              <span className="font-mono text-lg font-bold text-primary">
                {formatBRL(pedido.vlrtotal)}
              </span>
            </div>
          </div>

          {/* Observação interna */}
          {pedido.obsinter && (
            <div className="rounded-(--radius) border border-border bg-muted/20 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                Observação interna
              </p>
              <p className="text-sm text-foreground">{pedido.obsinter}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Itens */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Package size={20} className="text-primary" />
            Itens do Pedido
            <span className="ml-auto text-sm font-normal text-muted-foreground">
              {pedido.itens.length}{" "}
              {pedido.itens.length === 1 ? "item" : "itens"}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pedido.itens.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-10 text-muted-foreground">
              <Package size={24} />
              <span className="text-sm">Nenhum item</span>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {pedido.itens.map((item) => {
                const impItem = (item.vIPI ?? 0) + (item.vST ?? 0);
                const totalLinha = item.total + impItem;
                return (
                  <li key={item.seq} className="py-3">
                    <div className="flex items-start gap-2">
                      <span className="font-mono text-xs text-muted-foreground pt-0.5 w-12 shrink-0">
                        #{item.idprod}
                      </span>
                      <span className="text-sm font-medium flex-1 leading-snug">
                        {item.nomeProduto}
                      </span>
                      <span className="font-mono text-sm font-semibold shrink-0">
                        {formatBRL(totalLinha)}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 pl-14 font-mono text-xs text-muted-foreground">
                      <span>{formatQty(item.qtde)} × {formatBRL(item.unitario)}</span>
                      {impItem > 0 && <span>imp. {formatBRL(impItem)}</span>}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Botão Voltar inferior */}
      <div className="flex justify-start">
        <Button variant="outline" onClick={goBack} className="gap-2">
          <ArrowLeft size={16} />
          Voltar para a lista
        </Button>
      </div>
    </div>
  );
}

export default function OrderViewPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto max-w-xl px-3 py-4">
          <div className="flex items-center justify-center py-20">
            <Spinner size="lg" />
          </div>
        </div>
      }
    >
      <ViewOrderContent />
    </Suspense>
  );
}
