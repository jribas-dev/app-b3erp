/**
 * Arredonda preço para 2 casas decimais seguindo regra fiscal:
 * o terceiro dígito decimal > 5 arredonda para cima; <= 5 arredonda para baixo.
 * Valores inválidos ou negativos viram 0.
 */
export function roundPrice(v: number): number {
  if (!Number.isFinite(v) || v < 0) return 0;
  const stable = Math.round(v * 10000) / 10000;
  const str = stable.toFixed(4);
  const [intPart, decPart = "0000"] = str.split(".");
  const d1 = decPart[0] ?? "0";
  const d2 = decPart[1] ?? "0";
  const d3 = parseInt(decPart[2] ?? "0", 10);
  const base = parseFloat(`${intPart}.${d1}${d2}`);
  return d3 > 5 ? Math.round((base + 0.01) * 100) / 100 : base;
}
