"use client";

import {
  ArrowLeft,
  Table2,
  Users,
  Package,
  Award,
  TrendingUp,
  CreditCard,
  ArrowLeftRight,
  ArrowUpDown,
  Truck,
  Loader2,
  type LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Callout, CalloutTitle, CalloutDescription } from "@/components/ui/callout";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDashGrid } from "@/hooks/useDashGrid.hook";
import type { Dominio, Periodo } from "@/types/dash.types";
import { formatBRL } from "@/lib/format/currency";
import { formatDecimal } from "@/lib/format/number";

// ── config ─────────────────────────────────────────────────────────────────────

interface ListaConfig {
  key: string;
  label: string;
  icon: LucideIcon;
}

const LISTAS: Record<Dominio, ListaConfig[]> = {
  faturamento: [
    { key: "por-cliente", label: "Por Cliente", icon: Users },
    { key: "por-produto", label: "Por Produto", icon: Package },
    { key: "por-vendedor", label: "Por Vendedor", icon: Award },
  ],
  financeiro: [
    { key: "receber", label: "A Receber", icon: TrendingUp },
    { key: "pagar", label: "A Pagar", icon: CreditCard },
    { key: "movimentos", label: "Movimentos", icon: ArrowLeftRight },
  ],
  estoque: [
    { key: "lancamentos", label: "Lançamentos", icon: ArrowUpDown },
    { key: "por-produto", label: "Por Produto", icon: Package },
    { key: "por-fornecedor", label: "Por Fornecedor", icon: Truck },
  ],
};

const DOMINIOS: { value: Dominio; label: string }[] = [
  { value: "faturamento", label: "Faturamento" },
  { value: "financeiro", label: "Financeiro" },
  { value: "estoque", label: "Estoque" },
];

const PERIODOS: { value: Periodo; label: string }[] = [
  { value: "S", label: "Semanal" },
  { value: "M", label: "Mensal" },
  { value: "T", label: "Trimestral" },
];

const STATUS_OPTIONS: Partial<Record<string, { value: string; label: string }[]>> = {
  "financeiro/receber": [
    { value: "", label: "Todos" },
    { value: "pago", label: "Pago" },
    { value: "vencido", label: "Vencido" },
    { value: "aberto", label: "Aberto" },
  ],
  "financeiro/pagar": [
    { value: "", label: "Todos" },
    { value: "pago", label: "Pago" },
    { value: "vencido", label: "Vencido" },
    { value: "aberto", label: "Aberto" },
  ],
  "estoque/lancamentos": [
    { value: "", label: "Todos" },
    { value: "entradas", label: "Entradas" },
    { value: "saidas", label: "Saídas" },
  ],
  "estoque/por-produto": [
    { value: "", label: "Todos" },
    { value: "ruptura", label: "Apenas Ruptura" },
  ],
};

// ── column definitions ─────────────────────────────────────────────────────────

type ColFormat = "brl" | "decimal3" | "date" | "badge-status" | "badge-debcred" | "bool";

interface ColDef {
  header: string;
  accessor: string;
  align?: "right";
  format?: ColFormat;
}

const COLUNAS: Record<string, ColDef[]> = {
  "faturamento/por-cliente": [
    { header: "Cliente", accessor: "razao" },
    { header: "CNPJ/CPF", accessor: "docfed" },
    { header: "NFs", accessor: "qtdPedidos", align: "right" },
    { header: "Total", accessor: "valorTotal", align: "right", format: "brl" },
    { header: "Ticket Médio", accessor: "ticketMedio", align: "right", format: "brl" },
    { header: "Último Pedido", accessor: "ultimoPedidoEm", format: "date" },
  ],
  "faturamento/por-produto": [
    { header: "Produto", accessor: "nome" },
    { header: "Cód.", accessor: "codigo" },
    { header: "Un", accessor: "unidade" },
    { header: "Qtde", accessor: "qtdeTotal", align: "right", format: "decimal3" },
    { header: "Total", accessor: "valorTotal", align: "right", format: "brl" },
    { header: "Preço Médio", accessor: "precoMedio", align: "right", format: "brl" },
  ],
  "faturamento/por-vendedor": [
    { header: "Vendedor", accessor: "nomeVendedor" },
    { header: "NFs", accessor: "qtdPedidos", align: "right" },
    { header: "Total", accessor: "valorTotal", align: "right", format: "brl" },
    { header: "Clientes", accessor: "clientesUnicos", align: "right" },
    { header: "Ticket Médio", accessor: "ticketMedio", align: "right", format: "brl" },
  ],
  "financeiro/receber": [
    { header: "Cliente", accessor: "cliente" },
    { header: "Emissão", accessor: "emissao", format: "date" },
    { header: "Vencimento", accessor: "vencimento", format: "date" },
    { header: "Valor", accessor: "valor", align: "right", format: "brl" },
    { header: "Pago", accessor: "valorpago", align: "right", format: "brl" },
    { header: "Status", accessor: "status", format: "badge-status" },
  ],
  "financeiro/pagar": [
    { header: "Fornecedor", accessor: "fornecedor" },
    { header: "Doc.", accessor: "nrodoc" },
    { header: "Vencimento", accessor: "vencimentoMin", format: "date" },
    { header: "Total", accessor: "valortotal", align: "right", format: "brl" },
    { header: "Pago", accessor: "valorPagoAcum", align: "right", format: "brl" },
    { header: "Status", accessor: "status", format: "badge-status" },
  ],
  "financeiro/movimentos": [
    { header: "Data", accessor: "dataemi", format: "date" },
    { header: "D/C", accessor: "debcred", format: "badge-debcred" },
    { header: "Espécie", accessor: "especie" },
    { header: "Destino", accessor: "destino" },
    { header: "Valor", accessor: "valor", align: "right", format: "brl" },
    { header: "Baixado", accessor: "baixado", format: "bool" },
  ],
  "estoque/lancamentos": [
    { header: "Data", accessor: "dthrestoque", format: "date" },
    { header: "Tipo", accessor: "tipo", format: "badge-debcred" },
    { header: "Produto", accessor: "produto" },
    { header: "SKU", accessor: "sku" },
    { header: "Qtde", accessor: "qtde", align: "right", format: "decimal3" },
    { header: "Custo", accessor: "custo", align: "right", format: "brl" },
  ],
  "estoque/por-produto": [
    { header: "Produto", accessor: "nome" },
    { header: "Cód.", accessor: "codigo" },
    { header: "Un", accessor: "unidade" },
    { header: "Saldo", accessor: "saldoatu", align: "right", format: "decimal3" },
    { header: "Mín.", accessor: "saldomin", align: "right", format: "decimal3" },
    { header: "Custo Médio", accessor: "customedio", align: "right", format: "brl" },
    { header: "Val. Estoque", accessor: "valorEstoque", align: "right", format: "brl" },
  ],
  "estoque/por-fornecedor": [
    { header: "Fornecedor", accessor: "razao" },
    { header: "CNPJ/CPF", accessor: "docfed" },
    { header: "Compras", accessor: "qtdCompras", align: "right" },
    { header: "Total", accessor: "valorTotal", align: "right", format: "brl" },
    { header: "Última Compra", accessor: "ultimaCompraEm", format: "date" },
  ],
};

// ── formatters ─────────────────────────────────────────────────────────────────

function formatValue(value: unknown, format?: ColFormat): React.ReactNode {
  if (value === null || value === undefined) return "—";

  switch (format) {
    case "brl":
      return formatBRL(Number(value));
    case "decimal3":
      return formatDecimal(Number(value));
    case "date":
      return new Date(String(value)).toLocaleDateString("pt-BR");
    case "bool":
      return value ? "Sim" : "Não";
    case "badge-status": {
      const s = String(value);
      const cls =
        s === "pago"
          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
          : s === "vencido"
            ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
            : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300";
      return (
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>
          {s}
        </span>
      );
    }
    case "badge-debcred": {
      const v = String(value);
      const isPositive = v === "C" || v === "E";
      const cls = isPositive
        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
        : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300";
      const label = v === "C" ? "Crédito" : v === "D" ? "Débito" : v === "E" ? "Entrada" : "Saída";
      return (
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>
          {label}
        </span>
      );
    }
    default:
      return String(value);
  }
}

// ── table components ──────────────────────────────────────────────────────────

function GridTable({
  cols,
  rows,
}: {
  cols: ColDef[];
  rows: Record<string, unknown>[];
}) {
  return (
    <div className="overflow-x-auto rounded-(--radius) border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/50 border-b border-border">
            {cols.map((c) => (
              <th
                key={c.accessor}
                className={`py-2.5 px-3 text-xs font-semibold text-muted-foreground whitespace-nowrap ${c.align === "right" ? "text-right" : "text-left"}`}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-muted/30 transition-colors">
              {cols.map((c) => (
                <td
                  key={c.accessor}
                  className={`py-2 px-3 text-sm ${c.align === "right" ? "text-right" : ""} ${c.accessor === cols[0].accessor ? "font-medium" : "text-muted-foreground"}`}
                >
                  {formatValue(row[c.accessor], c.format)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function GridCards({
  cols,
  rows,
}: {
  cols: ColDef[];
  rows: Record<string, unknown>[];
}) {
  const [primary, ...rest] = cols;
  const secondary = rest.slice(0, 2);
  const extra = rest.slice(2);

  return (
    <div className="space-y-2">
      {rows.map((row, i) => (
        <div key={i} className="border border-border rounded-(--radius) px-3 py-2.5 bg-card">
          <p className="text-sm font-medium leading-snug">
            {formatValue(row[primary.accessor], primary.format)}
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5">
            {secondary.map((c) => (
              <span key={c.accessor} className="flex items-center gap-1 text-xs">
                <span className="text-muted-foreground">{c.header}:</span>
                <span className="font-medium">{formatValue(row[c.accessor], c.format)}</span>
              </span>
            ))}
          </div>
          {extra.length > 0 && (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
              {extra.map((c) => (
                <span key={c.accessor} className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span>{c.header}:</span>
                  <span>{formatValue(row[c.accessor], c.format)}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── page ───────────────────────────────────────────────────────────────────────

export default function DashGridPage() {
  const router = useRouter();
  const {
    emitentes,
    selectedIdemp,
    onIdempChange,
    isLoadingInit,
    selectedDominio,
    onDominioChange,
    selectedTipo,
    onTipoChange,
    selectedPeriodo,
    onPeriodoChange,
    selectedStatus,
    onStatusChange,
    page,
    onPageChange,
    gridData,
    isLoadingGrid,
    error,
  } = useDashGrid();

  const listasAtivas = LISTAS[selectedDominio];
  const colKey = selectedTipo ? `${selectedDominio}/${selectedTipo}` : null;
  const cols = colKey ? (COLUNAS[colKey] ?? []) : [];
  const statusKey = selectedTipo ? `${selectedDominio}/${selectedTipo}` : null;
  const statusOpts = statusKey ? STATUS_OPTIONS[statusKey] : undefined;

  const totalPages = gridData ? Math.max(1, Math.ceil(gridData.total / gridData.limit)) : 1;

  return (
    <div className="container mx-auto max-w-5xl px-3 py-4 space-y-4">
      {/* header */}
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={() => router.push("/home")} className="gap-2">
          <ArrowLeft size={16} />
          Voltar
        </Button>
        <Table2 size={20} className="text-primary shrink-0" />
        <h1 className="text-xl font-semibold leading-tight">Dashboard com Listagens</h1>
      </div>

      {/* empresa */}
      {isLoadingInit ? (
        <div className="flex items-center gap-2 h-10 px-3 border rounded-(--radius) bg-muted/40">
          <Spinner size="sm" tone="muted" />
          <span className="text-sm text-muted-foreground">Carregando empresas…</span>
        </div>
      ) : emitentes.length > 1 ? (
        <div className="grid gap-1.5">
          <Label>Empresa</Label>
          <Select
            value={selectedIdemp ? String(selectedIdemp) : undefined}
            onValueChange={(v) => onIdempChange(Number(v))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a empresa" />
            </SelectTrigger>
            <SelectContent>
              {emitentes.map((e) => (
                <SelectItem key={e.id} value={String(e.id)}>
                  {e.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : null}

      {/* módulo */}
      {!isLoadingInit && (
        <div className="grid gap-1.5">
          <Label>Módulo</Label>
          <div className="flex gap-2">
            {DOMINIOS.map((d) => (
              <Button
                key={d.value}
                variant={selectedDominio === d.value ? "default" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => onDominioChange(d.value)}
              >
                {d.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* lista */}
      {!isLoadingInit && (
        <div className="grid gap-1.5">
          <Label>Lista</Label>
          <div className="grid grid-cols-3 gap-2">
            {listasAtivas.map(({ key, label, icon: Icon }) => {
              const isSelected = selectedTipo === key;
              return (
                <button
                  key={key}
                  onClick={() => onTipoChange(key)}
                  className={[
                    "flex flex-col items-center justify-center gap-1.5 rounded-(--radius) border px-2 py-3 text-xs font-medium transition-colors",
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-foreground hover:bg-muted/60",
                  ].join(" ")}
                >
                  <Icon size={18} className="shrink-0" />
                  <span className="text-center leading-tight">{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* período */}
      {!isLoadingInit && (
        <div className="grid gap-1.5">
          <Label>Período</Label>
          <div className="flex gap-2">
            {PERIODOS.map((p) => (
              <Button
                key={p.value}
                variant={selectedPeriodo === p.value ? "default" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => onPeriodoChange(p.value)}
              >
                {p.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* filtro de status */}
      {!isLoadingInit && statusOpts && (
        <div className="grid gap-1.5">
          <Label>Filtro</Label>
          <div className="flex flex-wrap gap-2">
            {statusOpts.map((opt) => {
              const cur = selectedStatus ?? "";
              return (
                <Button
                  key={opt.value}
                  variant={cur === opt.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => onStatusChange(opt.value)}
                >
                  {opt.label}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* área de dados */}
      {!isLoadingInit && (
        <div className="min-h-48 border border-border rounded-(--radius) bg-card p-3 space-y-3">
          {isLoadingGrid ? (
            <div className="flex items-center justify-center h-48 gap-2 text-muted-foreground">
              <Loader2 size={20} className="animate-spin" />
              <span className="text-sm">Carregando dados…</span>
            </div>
          ) : error ? (
            <Callout variant="destructive">
              <CalloutTitle>Erro ao carregar</CalloutTitle>
              <CalloutDescription>{error}</CalloutDescription>
            </Callout>
          ) : gridData && cols.length > 0 ? (
            <>
              {/* info de paginação */}
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {gridData.total}{" "}
                  {gridData.total === 1 ? "registro" : "registros"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Pág {page} / {totalPages}
                </p>
              </div>

              {/* cards mobile */}
              <div className="md:hidden">
                <GridCards cols={cols} rows={gridData.items} />
              </div>

              {/* tabela desktop */}
              <div className="hidden md:block">
                <GridTable cols={cols} rows={gridData.items} />
              </div>

              {/* paginação */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => onPageChange(page - 1)}
                  >
                    ← Anterior
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    Pág {page} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() => onPageChange(page + 1)}
                  >
                    Próxima →
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 gap-2 text-muted-foreground">
              <Table2 size={36} className="opacity-30" />
              <p className="text-sm text-center">
                {!selectedIdemp && emitentes.length > 1
                  ? "Selecione a empresa"
                  : !selectedTipo
                    ? "Selecione uma lista"
                    : !selectedPeriodo
                      ? "Selecione o período"
                      : "Nenhum dado encontrado"}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
