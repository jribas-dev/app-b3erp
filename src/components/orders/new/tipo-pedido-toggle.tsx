"use client";

import { Check, Receipt, Truck } from "lucide-react";

import { Label } from "@/components/ui/label";

type TipoPedido = "F" | "E";

interface TipoPedidoToggleProps {
  value: TipoPedido;
  onChange: (v: TipoPedido) => void;
}

const OPTIONS = [
  {
    value: "F" as const,
    icon: Receipt,
    title: "Fiscal",
    subtitle: "Faturado",
  },
  {
    value: "E" as const,
    icon: Truck,
    title: "Estimativa",
    subtitle: "Entregue",
  },
];

export function TipoPedidoToggle({ value, onChange }: TipoPedidoToggleProps) {
  return (
    <div className="rounded-(--radius) border border-border bg-muted/30 p-4">
      <div className="flex items-center justify-between mb-3">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Tipo do Pedido
        </Label>
        <span className="text-xs text-muted-foreground">Escolha uma opção</span>
      </div>
      <div
        role="radiogroup"
        aria-label="Tipo do Pedido"
        className="grid grid-cols-2 gap-2"
      >
        {OPTIONS.map(({ value: opt, icon: Icon, title, subtitle }) => {
          const active = value === opt;
          return (
            <button
              key={opt}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(opt)}
              className={[
                "relative flex items-center gap-3 rounded-(--radius) border px-3 py-2.5 text-left transition-colors",
                active
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:bg-muted/60",
              ].join(" ")}
            >
              <div
                className={[
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground",
                ].join(" ")}
              >
                <Icon size={18} />
              </div>
              <div className="flex flex-col min-w-0">
                <span
                  className={[
                    "text-sm font-semibold leading-tight",
                    active ? "text-primary" : "text-foreground",
                  ].join(" ")}
                >
                  {title}
                </span>
                <span className="text-xs text-muted-foreground leading-tight">
                  {subtitle}
                </span>
              </div>
              {active && (
                <Check
                  size={16}
                  className="absolute right-2 top-2 text-primary"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
