import { z } from "zod";

export const SignInFormSchema = z.object({
  email: z
    .string({ message: "Deve ser uma string válida" })
    .email({ message: "Email inválido." })
    .trim(),
  password: z
    .string({ message: "Deve ser uma string válida" })
    .min(8, { message: "Senha deve conter 8 caracteres ou mais" })
    .regex(/[a-zA-Z]/, { message: "Conter ao menos uma letra." })
    .regex(/[0-9]/, { message: "Conter ao menos um número." })
    .trim(),
});

export type FormState =
  | {
      errors?: {
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;
