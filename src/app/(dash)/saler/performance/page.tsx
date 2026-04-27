"use client";

import { ArrowLeft, TrendingUp, Users, Loader2, RefreshCw, X, UserX, Phone, Mail, MapPin, Clock } from "lucide-react";
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
} from "recharts";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Callout, CalloutTitle, CalloutDescription } from "@/components/ui/callout";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { usePerformance, type MetricaTab, type MetricaData } from "@/hooks/usePerformance.hook";
import type { MetricaChartResponse, ClienteInativo } from "@/types/vendas.types";

// ── helpers ──────────────────────────────────────────────────────────────────

const fmtBRL = (n: number) =>
  `R$ ${n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const fmtDate = (iso: string | null) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
};

function transformLineData(res: MetricaChartResponse) {
  return res.labels.map((label, i) => {
    const entry: Record<string, string | number> = { label };
    res.series.forEach((s) => {
      entry[s.name] = s.data[i] ?? 0;
    });
    return entry;
  });
}

function transformBarData(res: MetricaChartResponse) {
  return res.labels.map((label, i) => ({
    label,
    valor: res.series[0]?.data[i] ?? 0,
    pedidos: res.series[1]?.data[i] ?? 0,
  }));
}

// ── chart tooltip ─────────────────────────────────────────────────────────────

function ChartTooltip({
  active,
  payload,
  label,
  currency,
}: {
  active?: boolean;
  payload?: { name: string; value: number }[];
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
            {currency ? fmtBRL(p.value) : p.value}
          </span>
        </p>
      ))}
    </div>
  );
}

// ── line chart ────────────────────────────────────────────────────────────────

function LineMetricaChart({ data }: { data: MetricaChartResponse }) {
  const chartData = transformLineData(data);
  const seriesName = data.series[0]?.name ?? "Valor";

  return (
    <div className="w-full h-64 sm:h-72">
      <ResponsiveContainer width="100%" height="100%">
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
            tickFormatter={(v) =>
              v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)
            }
            width={46}
          />
          <Tooltip content={<ChartTooltip currency />} />
          <Line
            type="monotone"
            dataKey={seriesName}
            stroke="var(--primary)"
            strokeWidth={2}
            dot={{ r: 3, fill: "var(--primary)", strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── bar chart (horizontal) ────────────────────────────────────────────────────

function BarMetricaChart({ data }: { data: MetricaChartResponse }) {
  const chartData = transformBarData(data).reverse();
  const maxLabelLen = 22;

  return (
    <div className="w-full" style={{ height: Math.max(260, chartData.length * 36 + 40) }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={chartData}
          margin={{ top: 4, right: 16, left: 0, bottom: 4 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            tickFormatter={(v) =>
              v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)
            }
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
                payload={payload as unknown as { name: string; value: number }[]}
                label={label as string}
                currency
              />
            )}
          />
          <Bar dataKey="valor" name="Valor (R$)" fill="var(--primary)" radius={[0, 3, 3, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── clientes inativos list ────────────────────────────────────────────────────

function ClientesInativosList({ data }: { data: ClienteInativo[] }) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground">
        <UserX size={36} className="opacity-40" />
        <p className="text-sm">Nenhum cliente inativo nos últimos 60 dias</p>
      </div>
    );
  }

  return (
    <>
      <p className="text-xs text-muted-foreground px-1 mb-2">
        {data.length} {data.length === 1 ? "cliente inativo" : "clientes inativos"} nos últimos 60 dias
      </p>

      {/* Mobile cards */}
      <div className="md:hidden space-y-2">
        {data.map((c) => (
          <div
            key={c.id}
            className="border border-border rounded-(--radius) px-3 py-2.5 bg-card"
          >
            <p className="text-sm font-medium leading-snug">{c.nome}</p>
            <div className="mt-1.5 space-y-0.5">
              {(c.fone || c.cel) && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Phone size={12} className="shrink-0" />
                  <span>{c.fone ?? c.cel}</span>
                </div>
              )}
              {c.cidade && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin size={12} className="shrink-0" />
                  <span>{c.cidade}{c.uf ? ` — ${c.uf}` : ""}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock size={12} className="shrink-0" />
                <span>Última venda: {fmtDate(c.ultimaVenda)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto rounded-(--radius) border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground">Nome</th>
              <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground">Doc.</th>
              <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground">
                <Mail size={12} className="inline mr-1" />E-mail
              </th>
              <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground">Contato</th>
              <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground">Cidade</th>
              <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground">Última venda</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {data.map((c) => (
              <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                <td className="py-2 px-3 font-medium">{c.nome}</td>
                <td className="py-2 px-3 text-xs font-mono text-muted-foreground">{c.docfed ?? "—"}</td>
                <td className="py-2 px-3 text-xs text-muted-foreground">{c.email ?? "—"}</td>
                <td className="py-2 px-3 text-xs text-muted-foreground">{c.fone ?? c.cel ?? "—"}</td>
                <td className="py-2 px-3 text-xs text-muted-foreground">
                  {c.cidade ? `${c.cidade}${c.uf ? ` — ${c.uf}` : ""}` : "—"}
                </td>
                <td className="py-2 px-3 text-xs text-muted-foreground">{fmtDate(c.ultimaVenda)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ── content dispatcher ────────────────────────────────────────────────────────

function MetricaContent({ tab, data }: { tab: MetricaTab; data: MetricaData }) {
  if (tab === "clientes-inativos") {
    return <ClientesInativosList data={data as ClienteInativo[]} />;
  }
  const chart = data as MetricaChartResponse;
  if (chart.chartType === "bar_h") return <BarMetricaChart data={chart} />;
  return <LineMetricaChart data={chart} />;
}

// ── page ──────────────────────────────────────────────────────────────────────

const TABS: { value: MetricaTab; label: string }[] = [
  { value: "vendas-semanais", label: "Semanal" },
  { value: "vendas-mensais", label: "Mensal" },
  { value: "top-clientes", label: "Ranking" },
  { value: "clientes-inativos", label: "Inativos" },
];

export default function PerformancePage() {
  const router = useRouter();
  const {
    isLoadingInit,
    isSupervisor,
    equipe,
    selectedVendedor,
    isComboboxActive,
    onActivateCombobox,
    onCancelCombobox,
    onVendedorSelect,
    activeTab,
    onTabChange,
    isLoadingMetrica,
    metricaData,
    metricaError,
  } = usePerformance();

  return (
    <div className="container mx-auto max-w-5xl px-3 py-4 space-y-4">
      {/* Título */}
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={() => router.push("/home")} className="gap-2">
          <ArrowLeft size={16} />
          Voltar
        </Button>
        <TrendingUp size={20} className="text-primary" />
        <h1 className="text-xl font-semibold">Análise de Desempenho</h1>
      </div>

      {/* Campo 1 + 2: seletor de vendedor */}
      <div className="grid gap-1.5">
        <Label>Vendedor</Label>

        {isLoadingInit ? (
          <div className="flex items-center gap-2 h-10 px-3 border rounded-(--radius) bg-muted/40">
            <Spinner size="sm" tone="muted" />
            <span className="text-sm text-muted-foreground">Carregando equipe…</span>
          </div>
        ) : isComboboxActive ? (
          <div className="flex items-center gap-2">
            <Select
              defaultValue={selectedVendedor ? String(selectedVendedor.id) : undefined}
              onValueChange={(v) => {
                const membro = equipe.find((m) => String(m.id) === v);
                if (membro) onVendedorSelect(membro);
              }}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Selecione um vendedor" />
              </SelectTrigger>
              <SelectContent>
                {equipe.map((m) => (
                  <SelectItem key={m.id} value={String(m.id)}>
                    {m.razao}
                    {m.liderado === 0 ? " (você)" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="ghost" size="sm" onClick={onCancelCombobox} aria-label="Cancelar">
              <X size={16} />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 h-10 px-3 border rounded-(--radius) bg-muted/40 flex-1 min-w-0">
              <Users size={14} className="text-muted-foreground shrink-0" />
              <span className="text-sm truncate">{selectedVendedor?.razao ?? "—"}</span>
            </div>
            {isSupervisor && equipe.length > 1 && (
              <Button variant="outline" size="sm" onClick={onActivateCombobox} className="gap-1.5 shrink-0">
                <RefreshCw size={14} />
                Trocar
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Campo 3: mini menu de métricas */}
      {!isLoadingInit && (
        <div className="overflow-x-auto">
          <Tabs value={activeTab} onValueChange={(v) => onTabChange(v as MetricaTab)}>
            <TabsList className="min-w-full">
              {TABS.map((t) => (
                <TabsTrigger key={t.value} value={t.value}>
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      )}

      {/* Campo 4: conteúdo */}
      {!isLoadingInit && (
        <div className="min-h-65">
          {isLoadingMetrica ? (
            <div className="flex items-center justify-center py-16 gap-2 text-muted-foreground">
              <Loader2 size={20} className="animate-spin" />
              <span className="text-sm">Carregando dados…</span>
            </div>
          ) : metricaError ? (
            <Callout variant="destructive">
              <CalloutTitle>Erro ao carregar</CalloutTitle>
              <CalloutDescription>{metricaError}</CalloutDescription>
            </Callout>
          ) : metricaData !== null ? (
            <MetricaContent tab={activeTab} data={metricaData} />
          ) : null}
        </div>
      )}
    </div>
  );
}
