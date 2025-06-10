import { z } from "zod";

export const SignInFormSchema = z.object({
  email: z
    .string({ message: "Deve ser uma string válida" })
    .email({ message: "E-mail inválido" })
    .min(1, { message: "Informe seu e-mail" })
    .trim(),
  password: z
    .string({ message: "Deve ser uma string válida" })
    .min(1, { message: "Informe sua senha" })
    .trim(),
});

export type SignInFormData = z.infer<typeof SignInFormSchema>;
