const decimal2Formatter = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const qtyFormatter = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 3,
  maximumFractionDigits: 3,
});

export function formatDecimal(value: number | null | undefined): string {
  return decimal2Formatter.format(value ?? 0);
}

export function formatQty(value: number | null | undefined): string {
  return qtyFormatter.format(value ?? 0);
}

export function formatPct(value: number | null | undefined): string {
  return `${decimal2Formatter.format(value ?? 0)}%`;
}
