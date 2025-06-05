import { z } from "zod";

// FORM - LOGIN
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

// FORM - PRE CADASTRO
export const preRegisterSchema = z.object({
  email: z.string().email("Email inválido").min(1, "Email é obrigatório"),
  token: z.string().min(1, "Token é obrigatório"),
});

// FORM - CADASTRO COMPLETO
export const completeRegisterSchema = z
  .object({
    name: z.string().min(3, "Nome completo é obrigatório"),
    phone: z
      .string()
      .min(1, "Telefone é obrigatório")
      .regex(
        /^\(?([0-9]{2})\)?[-. ]?([0-9]{4,5})[-. ]?([0-9]{4})$/,
        "Formato de telefone inválido"
      ),
    password: z
      .string()
      .min(8, "Senha deve ter pelo menos 8 caracteres")
      .regex(/[a-zA-Z]/, "Senha deve conter pelo menos uma letra")
      .regex(/[0-9]/, "Senha deve conter pelo menos um número"),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "As senhas não conferem",
    path: ["passwordConfirm"],
  });

export type SignInFormData = z.infer<typeof SignInFormSchema>;
export type PreRegisterFormData = z.infer<typeof preRegisterSchema>;
export type CompleteRegisterFormData = z.infer<typeof completeRegisterSchema>;

export type FormState =
  | {
      errors?: {
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;
