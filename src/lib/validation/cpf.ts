/**
 * Verifica se uma string de 11 dígitos é um CPF válido segundo o algoritmo
 * de dígitos verificadores. Não trata máscara — passe apenas dígitos.
 */
export function isValidCPF(d: string): boolean {
  if (d.length !== 11) return false;
  if (/^(.)\1+$/.test(d)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(d[i]) * (10 - i);
  let rem = (sum * 10) % 11;
  if (rem >= 10) rem = 0;
  if (rem !== parseInt(d[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(d[i]) * (11 - i);
  rem = (sum * 10) % 11;
  if (rem >= 10) rem = 0;
  return rem === parseInt(d[10]);
}
