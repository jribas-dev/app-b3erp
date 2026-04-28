/**
 * Verifica se uma string de 14 dígitos é um CNPJ válido segundo o algoritmo
 * de dígitos verificadores. Não trata máscara — passe apenas dígitos.
 */
export function isValidCNPJ(d: string): boolean {
  if (d.length !== 14) return false;
  if (/^(.)\1+$/.test(d)) return false;
  const w1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const w2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum = w1.reduce((s, w, i) => s + parseInt(d[i]) * w, 0);
  let rem = sum % 11;
  if ((rem < 2 ? 0 : 11 - rem) !== parseInt(d[12])) return false;
  sum = w2.reduce((s, w, i) => s + parseInt(d[i]) * w, 0);
  rem = sum % 11;
  return (rem < 2 ? 0 : 11 - rem) === parseInt(d[13]);
}
