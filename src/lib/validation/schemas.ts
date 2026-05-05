import { z } from "zod";

import { isValidCNPJ } from "./cnpj";
import { isValidCPF } from "./cpf";

/**
 * Schemas Zod reutilizáveis — pluga em forms e em payloads de actions.
 *
 * Convenções:
 * - Mensagens em pt-BR (chegam direto à UI via `FieldError` ou
 *   `ActionResult.error`).
 * - Operam sobre strings com máscara visível (CPF, CNPJ, CEP, telefone),
 *   permitindo que o form mantenha display formatado e o consumidor extraia
 *   apenas dígitos antes de enviar ao backend.
 */

const onlyDigits = (s: string) => s.replace(/\D/g, "");

export const cpfOrCnpjMasked = z
  .string()
  .refine(
    (v) => {
      const raw = onlyDigits(v);
      if (!raw) return true; // vazio é tratado por .min/.optional pelo consumidor
      if (raw.length === 11) return isValidCPF(raw);
      if (raw.length === 14) return isValidCNPJ(raw);
      return false;
    },
    { message: "CPF/CNPJ inválido" },
  );

export const cpfMasked = z.string().refine(
  (v) => {
    const raw = onlyDigits(v);
    return !raw || (raw.length === 11 && isValidCPF(raw));
  },
  { message: "CPF inválido" },
);

export const cnpjMasked = z.string().refine(
  (v) => {
    const raw = onlyDigits(v);
    return !raw || (raw.length === 14 && isValidCNPJ(raw));
  },
  { message: "CNPJ inválido" },
);

export const brazilianCepMasked = z.string().refine(
  (v) => {
    const raw = onlyDigits(v);
    return !raw || raw.length === 8;
  },
  { message: "CEP deve ter 8 dígitos" },
);

export const brazilianPhoneMasked = z.string().refine(
  (v) => {
    const raw = onlyDigits(v);
    return !raw || raw.length === 10 || raw.length === 11;
  },
  { message: "Telefone inválido" },
);

export const brazilianUF = z
  .string()
  .max(2, "UF deve ter 2 caracteres")
  .regex(/^([A-Za-z]{0,2})$/, "UF deve conter apenas letras");

export const brazilianEmail = z
  .string()
  .email("E-mail inválido")
  .or(z.literal(""));

export const positiveId = z.number().int().positive();
