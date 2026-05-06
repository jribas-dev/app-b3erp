"use client";

import {
  ArrowLeft,
  BarChart2,
  TrendingUp,
  Receipt,
  Package,
  Users,
  Award,
  PieChart as PieChartIcon,
  ArrowLeftRight,
  Waves,
  AlertTriangle,
  UserX,
  Banknote,
  Landmark,
  ArrowUpDown,
  ShoppingCart,
  Truck,
  AlertCircle,
  Layers,
  Loader2,
  type LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Callout, CalloutTitle, CalloutDescription } from "@/components/ui/callout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useDashGraph } from "@/hooks/useDashGraph.hook";
import type { ChartDataDto, Dominio, Periodo } from "@/types/dash.types";
import { formatBRL } from "@/lib/format/currency";

// ── types ──────────────────────────────────────────────────────────────────────

interface MetricaConfig {
  key: string;
  label: string;
  icon: LucideIcon;
}

// ── config ─────────────────────────────────────────────────────────────────────

const METRICAS: Record<Dominio, MetricaConfig[]> = {
  faturamento: [
    { key: "evolucao", label: "Evolução", icon: TrendingUp },
    { key: "ticket-medio", label: "Ticket Médio", icon: Receipt },
    { key: "top-produtos", label: "Top Produtos", icon: Package },
    { key: "top-clientes", label: "Top Clientes", icon: Users },
    { key: "ranking-vendedores", label: "Ranking Vendedores", icon: Award },
    { key: "mix-operacoes", label: "Mix Operações", icon: PieChartIcon },
  ],
  financeiro: [
    { key: "receber-vs-pagar", label: "Receber × Pagar", icon: ArrowLeftRight },
    { key: "fluxo-caixa-projetado", label: "Fluxo Projetado", icon: Waves },
    { key: "inadimplencia", label: "Inadimplência", icon: AlertTriangle },
    { key: "top-inadimplentes", label: "Top Inadimp.", icon: UserX },
    { key: "entradas-por-especie", label: "Entradas/Espécie", icon: Banknote },
    { key: "saldo-destinos", label: "Saldo Destinos", icon: Landmark },
  ],
  estoque: [
    { key: "entradas-vs-saidas", label: "Entradas × Saídas", icon: ArrowUpDown },
    { key: "top-produtos-comprados", label: "Top Comprados", icon: ShoppingCart },
    { key: "top-fornecedores", label: "Top Fornecedores", icon: Truck },
    { key: "curva-abc", label: "Curva ABC", icon: BarChart2 },
    { key: "ruptura", label: "Ruptura", icon: AlertCircle },
    { key: "valor-por-grupo", label: "Valor por Grupo", icon: Layers },
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

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

// ── chart tooltip ──────────────────────────────────────────────────────────────

function ChartTooltip({
  active,
  payload,
  label,
  currency,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color?: string }[];
  label?: string;
  currency?: boolean;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-(--radius) px-3 py-2 shadow-md text-xs space-y-1">
      <p className="font-semibold text-foreground">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="text-muted-foreground">
          {p.name}:{" "}
          <span className="font-medium text-foreground">
            {currency ? formatBRL(p.value) : p.value}
          </span>
        </p>
      ))}
    </div>
  );
}

// ── line chart ─────────────────────────────────────────────────────────────────

function DashLineChart({ data, currency }: { data: ChartDataDto; currency?: boolean }) {
  const chartData = data.labels.map((label, i) => {
    const entry: Record<string, string | number> = { label };
    data.series.forEach((s) => {
      entry[s.name] = s.data[i] ?? 0;
    });
    return entry;
  });

  return (
    <div className="w-full h-64 sm:h-72">
      <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 1, height: 1 }}>
        <LineChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            angle={-45}
            textAnchor="end"
            interval={0}
            height={60}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v))}
            width={46}
          />
          <Tooltip
            content={({ active, payload, label }) => (
              <ChartTooltip
                active={active}
                payload={payload as unknown as { name: string; value: number; color?: string }[]}
                label={label as string}
                currency={currency}
              />
            )}
          />
          {data.series.map((s, i) => (
            <Line
              key={s.name}
              type="monotone"
              dataKey={s.name}
              stroke={CHART_COLORS[i % CHART_COLORS.length]}
              strokeWidth={2}
              dot={{ r: 3, fill: CHART_COLORS[i % CHART_COLORS.length], strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── horizontal bar chart ───────────────────────────────────────────────────────

function DashBarHChart({ data, currency }: { data: ChartDataDto; currency?: boolean }) {
  const chartData = data.labels
    .map((label, i) => ({ label, valor: data.series[0]?.data[i] ?? 0 }))
    .reverse();
  const maxLabelLen = 22;

  return (
    <div className="w-full" style={{ height: Math.max(260, chartData.length * 36 + 40) }}>
      <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 1, height: 1 }}>
        <BarChart
          layout="vertical"
          data={chartData}
          margin={{ top: 4, right: 16, left: 0, bottom: 4 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v))}
          />
          <YAxis
            type="category"
            dataKey="label"
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            width={130}
            tickFormatter={(v: string) =>
              v.length > maxLabelLen ? v.slice(0, maxLabelLen) + "…" : v
            }
          />
          <Tooltip
            content={({ active, payload, label }) => (
              <ChartTooltip
                active={active}
                payload={payload as unknown as { name: string; value: number; color?: string }[]}
                label={label as string}
                currency={currency}
              />
            )}
          />
          <Bar
            dataKey="valor"
            name={data.series[0]?.name ?? "Valor"}
            fill="var(--chart-1)"
            radius={[0, 3, 3, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── vertical bar chart ─────────────────────────────────────────────────────────

function DashBarVChart({ data, currency }: { data: ChartDataDto; currency?: boolean }) {
  const chartData = data.labels.map((label, i) => ({
    label,
    valor: data.series[0]?.data[i] ?? 0,
  }));
  const maxLabelLen = 10;

  return (
    <div className="w-full h-64 sm:h-72">
      <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 1, height: 1 }}>
        <BarChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 48 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            angle={-35}
            textAnchor="end"
            interval={0}
            height={60}
            tickFormatter={(v: string) =>
              v.length > maxLabelLen ? v.slice(0, maxLabelLen) + "…" : v
            }
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v))}
            width={40}
          />
          <Tooltip
            content={({ active, payload, label }) => (
              <ChartTooltip
                active={active}
                payload={payload as unknown as { name: string; value: number; color?: string }[]}
                label={label as string}
                currency={currency}
              />
            )}
          />
          <Bar
            dataKey="valor"
            name={data.series[0]?.name ?? "Valor"}
            fill="var(--chart-1)"
            radius={[3, 3, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── pie chart ──────────────────────────────────────────────────────────────────

function DashPieChart({ data, currency }: { data: ChartDataDto; currency?: boolean }) {
  const chartData = data.labels.map((label, i) => ({
    name: label,
    value: data.series[0]?.data[i] ?? 0,
  }));

  return (
    <div className="w-full h-64 sm:h-72">
      <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 1, height: 1 }}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius="70%"
            label={({ name, percent }: { name?: string; percent?: number }) => {
              const n = name ?? "";
              const pct = percent ?? 0;
              return `${n.length > 12 ? n.slice(0, 12) + "…" : n} (${(pct * 100).toFixed(0)}%)`;
            }}
            labelLine={false}
          >
            {chartData.map((_, i) => (
              <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => (
              <ChartTooltip
                active={active}
                payload={payload as unknown as { name: string; value: number; color?: string }[]}
                currency={currency}
              />
            )}
          />
        </PieChart>
      </ResponsiveContainer>
      {/* legenda */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 justify-center mt-1">
        {chartData.map((d, i) => (
          <div key={d.name} className="flex items-center gap-1 text-xs text-muted-foreground">
            <span
              className="inline-block w-2.5 h-2.5 rounded-sm shrink-0"
              style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
            />
            {d.name}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── chart dispatcher ───────────────────────────────────────────────────────────

const CURRENCY_METRICS = new Set([
  "evolucao",
  "ticket-medio",
  "top-produtos",
  "top-clientes",
  "ranking-vendedores",
  "mix-operacoes",
  "receber-vs-pagar",
  "fluxo-caixa-projetado",
  "inadimplencia",
  "top-inadimplentes",
  "entradas-por-especie",
  "saldo-destinos",
  "top-fornecedores",
  "valor-por-grupo",
]);

function ChartDispatcher({ data, metrica }: { data: ChartDataDto; metrica: string }) {
  const currency = CURRENCY_METRICS.has(metrica);
  if (data.chartType === "bar_h") return <DashBarHChart data={data} currency={currency} />;
  if (data.chartType === "bar_v") return <DashBarVChart data={data} currency={currency} />;
  if (data.chartType === "pie") return <DashPieChart data={data} currency={currency} />;
  return <DashLineChart data={data} currency={currency} />;
}

// ── page ───────────────────────────────────────────────────────────────────────

export default function DashGraphPage() {
  const router = useRouter();
  const {
    emitentes,
    selectedIdemp,
    onIdempChange,
    isLoadingInit,
    selectedDominio,
    onDominioChange,
    selectedMetrica,
    onMetricaChange,
    selectedPeriodo,
    onPeriodoChange,
    chartData,
    isLoadingChart,
    error,
  } = useDashGraph();

  const metricasAtivas = METRICAS[selectedDominio];

  return (
    <div className="container mx-auto max-w-xl px-3 py-4 space-y-4">
      {/* header */}
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={() => router.push("/home")} className="gap-2">
          <ArrowLeft size={16} />
          Voltar
        </Button>
        <BarChart2 size={20} className="text-primary shrink-0" />
        <h1 className="text-xl font-semibold leading-tight">Dashboard com Gráficos</h1>
      </div>

      {/* empresa selector */}
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

      {/* domínio tabs */}
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

      {/* métricas */}
      {!isLoadingInit && (
        <div className="grid gap-1.5">
          <Label>Métrica</Label>
          <div className="grid grid-cols-3 gap-2">
            {metricasAtivas.map(({ key, label, icon: Icon }) => {
              const isSelected = selectedMetrica === key;
              return (
                <button
                  key={key}
                  onClick={() => onMetricaChange(key)}
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

      {/* área do gráfico */}
      {!isLoadingInit && (
        <div className="min-h-72 border border-border rounded-(--radius) bg-card p-3">
          {isLoadingChart ? (
            <div className="flex items-center justify-center h-64 gap-2 text-muted-foreground">
              <Loader2 size={20} className="animate-spin" />
              <span className="text-sm">Carregando dados…</span>
            </div>
          ) : error ? (
            <Callout variant="destructive">
              <CalloutTitle>Erro ao carregar</CalloutTitle>
              <CalloutDescription>{error}</CalloutDescription>
            </Callout>
          ) : chartData ? (
            <ChartDispatcher data={chartData} metrica={selectedMetrica ?? ""} />
          ) : (
            <div className="flex flex-col items-center justify-center h-64 gap-2 text-muted-foreground">
              <BarChart2 size={36} className="opacity-30" />
              <p className="text-sm text-center">
                {!selectedIdemp && emitentes.length > 1
                  ? "Selecione a empresa"
                  : !selectedMetrica
                    ? "Selecione uma métrica"
                    : "Selecione o período"}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
