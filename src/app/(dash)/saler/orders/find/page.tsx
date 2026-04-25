"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ClipboardList,
  Edit2,
  Eye,
  History,
  Loader2,
  RefreshCw,
  Search,
  ShoppingCart,
} from "lucide-react";

import { usePedidosLista } from "@/hooks/usePedidosLista.hook";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent } from "@/components/ui/card";
import { Callout, CalloutDescription } from "@/components/ui/callout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import type { PedidoLista } from "@/types/vendas.types";

const currency = (n: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n ?? 0);

const dateFmt = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

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
      className={`inline-flex items-center rounded-[100px] border px-2 py-0.5 text-xs font-semibold ${className}`}
    >
      {label}
    </span>
  );
}

function CountBadge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <span className="ml-1 rounded-[100px] bg-primary/15 px-1.5 py-0.5 text-xs font-semibold text-primary">
      {count}
    </span>
  );
}

function PedidoRow({
  pedido,
  action,
}: {
  pedido: PedidoLista;
  action: React.ReactNode;
}) {
  return (
    <li className="px-3 py-2.5 hover:bg-muted/30 transition-colors">
      <div className="flex items-baseline justify-between gap-1 mb-0.5">
        <span className="font-mono text-sm font-semibold text-foreground">
          #{pedido.id}
        </span>
        <span className="font-mono text-xs text-muted-foreground">
          {dateFmt(pedido.dthremissao)}
        </span>
      </div>
      <p className="text-sm font-medium text-foreground leading-snug mb-1.5">
        {pedido.razaoCliente}
      </p>
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-sm font-semibold">
          {currency(pedido.vlrtotal)}
        </span>
        {action}
      </div>
    </li>
  );
}

function FechadoRow({
  pedido,
  onVer,
}: {
  pedido: PedidoLista;
  onVer: () => void;
}) {
  return (
    <li className="px-3 py-2.5 hover:bg-muted/30 transition-colors">
      <div className="flex items-baseline justify-between gap-1 mb-0.5">
        <span className="font-mono text-sm font-semibold text-foreground">
          #{pedido.id}
        </span>
        <span className="font-mono text-xs text-muted-foreground">
          {dateFmt(pedido.dthremissao)}
        </span>
      </div>
      <p className="text-sm font-medium text-foreground leading-snug mb-1.5">
        {pedido.razaoCliente}
      </p>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <StatusBadge tipo={pedido.tipo} />
          <span className="font-mono text-sm font-semibold">
            {currency(pedido.vlrtotal)}
          </span>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={onVer}
          className="gap-1 h-7 px-2.5 text-xs shrink-0"
        >
          <Eye size={13} />
          Ver
        </Button>
      </div>
    </li>
  );
}

function ListaVazia({ mensagem }: { mensagem: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-muted-foreground">
      <ClipboardList size={28} />
      <span className="text-sm">{mensagem}</span>
    </div>
  );
}

export default function OrderFindPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("abertos");

  useEffect(() => {
    if (window.location.hash === "#history") {
      setActiveTab("historico");
    }
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const base = window.location.pathname + window.location.search;
    window.history.replaceState(null, "", value === "historico" ? `${base}#history` : base);
  };

  const {
    emitentes,
    isLoadingEmitentes,
    selectedIdemp,
    onIdemandChange,
    editaveis,
    isLoadingEditaveis,
    editaveisError,
    filteredFechados,
    isLoadingFechados,
    fechadosError,
    filtroCliente,
    setFiltroCliente,
    refresh,
  } = usePedidosLista();

  const isRefreshing = isLoadingEditaveis || isLoadingFechados;

  return (
    <div className="container mx-auto max-w-xl px-3 py-4 space-y-4">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/home")}
            className="gap-1.5 text-muted-foreground"
            aria-label="Voltar"
          >
            <ArrowLeft size={16} />
            Voltar
          </Button>
          <ShoppingCart size={20} className="text-primary shrink-0" />
          <h1 className="text-xl font-semibold text-foreground">
            Meus Pedidos
          </h1>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={refresh}
          disabled={isRefreshing || !selectedIdemp}
          aria-label="Atualizar lista"
          className="gap-1.5"
        >
          {isRefreshing ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <RefreshCw size={15} />
          )}
          Atualizar
        </Button>
      </div>

      {/* Seletor de empresa — visível apenas quando há mais de uma */}
      {!isLoadingEmitentes && emitentes.length > 1 && (
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-foreground shrink-0">
            Empresa
          </span>
          <Select
            value={selectedIdemp?.toString() ?? ""}
            onValueChange={(v) => onIdemandChange(Number(v))}
          >
            <SelectTrigger className="flex-1">
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

      {/* Loading inicial de emitentes */}
      {isLoadingEmitentes && (
        <div className="flex items-center justify-center py-16">
          <Spinner size="lg" />
        </div>
      )}

      {/* Tabs — visíveis após emitentes carregados */}
      {!isLoadingEmitentes && selectedIdemp && (
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="abertos">
              <Edit2 size={15} />
              Em Aberto
              <CountBadge count={editaveis.length} />
            </TabsTrigger>
            <TabsTrigger value="historico">
              <History size={15} />
              Histórico
            </TabsTrigger>
          </TabsList>

          {/* TAB 1 — Pedidos editáveis */}
          <TabsContent value="abertos">
            <Card>
              <CardContent className="p-0">
                {isLoadingEditaveis ? (
                  <div className="flex items-center justify-center py-14">
                    <Spinner size="lg" />
                  </div>
                ) : editaveisError ? (
                  <div className="p-4">
                    <Callout variant="destructive">
                      <CalloutDescription>{editaveisError}</CalloutDescription>
                    </Callout>
                  </div>
                ) : editaveis.length === 0 ? (
                  <ListaVazia mensagem="Nenhum pedido em aberto nos últimos 5 dias" />
                ) : (
                  <ul className="divide-y divide-border">
                    {editaveis.map((p) => (
                      <PedidoRow
                        key={p.id}
                        pedido={p}
                        action={
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              router.push(`/saler/orders/edit?id=${p.id}`)
                            }
                            className="gap-1 h-7 px-2.5 text-xs shrink-0"
                          >
                            <Edit2 size={13} />
                            Editar
                          </Button>
                        }
                      />
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 2 — Histórico (fechados) */}
          <TabsContent value="historico">
            <div className="space-y-3">
              {/* Filtro de cliente */}
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  value={filtroCliente}
                  onChange={(e) => setFiltroCliente(e.target.value)}
                  placeholder="Filtrar por cliente…"
                  className="pl-9"
                />
              </div>

              <Card>
                <CardContent className="p-0">
                  {isLoadingFechados ? (
                    <div className="flex items-center justify-center py-14">
                      <Spinner size="lg" />
                    </div>
                  ) : fechadosError ? (
                    <div className="p-4">
                      <Callout variant="destructive">
                        <CalloutDescription>
                          {fechadosError}
                        </CalloutDescription>
                      </Callout>
                    </div>
                  ) : filteredFechados.length === 0 ? (
                    <ListaVazia
                      mensagem={
                        filtroCliente.trim()
                          ? "Nenhum pedido encontrado para este cliente"
                          : "Nenhum pedido fechado nos últimos 30 dias"
                      }
                    />
                  ) : (
                    <ul className="divide-y divide-border">
                      {filteredFechados.map((p) => (
                        <FechadoRow
                          key={p.id}
                          pedido={p}
                          onVer={() =>
                            router.push(`/saler/orders/view?id=${p.id}`)
                          }
                        />
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* Estado: empresa não selecionada (múltiplas emitentes, nenhuma escolhida ainda) */}
      {!isLoadingEmitentes && !selectedIdemp && emitentes.length > 1 && (
        <div className="flex flex-col items-center justify-center gap-2 py-12 text-muted-foreground">
          <ShoppingCart size={28} />
          <span className="text-sm">Selecione uma empresa para visualizar os pedidos</span>
        </div>
      )}
    </div>
  );
}
