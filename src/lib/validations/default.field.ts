import { z } from "zod";

export const email_def = z
  .string()
  .email("Email inválido")
  .min(1, "Email é obrigatório");

export const password_def = z
  .string()
  .min(8, "Senha deve ter pelo menos 8 caracteres")
  .regex(/[a-zA-Z]/, "Senha deve conter pelo menos uma letra")
  .regex(/[0-9]/, "Senha deve conter pelo menos um número");

export const phone_def = z
  .string()
  .min(1, "Telefone é obrigatório")
  .regex(
    /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
    "Formato de telefone inválido. Use (99) 99999-9999"
  );

export const name_def = z
  .string()
  .min(3, "Nome deve ter pelo menos 3 caracteres")
  .max(100, "Nome deve ter no máximo 100 caracteres");
