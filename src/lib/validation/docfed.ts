import { isValidCNPJ } from "./cnpj";
import { isValidCPF } from "./cpf";

/**
 * Detecta automaticamente se a string é CPF (11 dígitos) ou CNPJ (14 dígitos)
 * e valida. Retorna mensagem de erro pt-BR ou `null` quando válido / vazio.
 */
export function validateDocfed(v: string): string | null {
  const d = v.replace(/\D/g, "");
  if (d.length === 0) return null;
  if (d.length !== 11 && d.length !== 14) {
    return "Informe um CPF (11 dígitos) ou CNPJ (14 dígitos)";
  }
  if (d.length === 11) return isValidCPF(d) ? null : "CPF inválido";
  return isValidCNPJ(d) ? null : "CNPJ inválido";
}
