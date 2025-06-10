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

// FORM USER-EDIT
export const UserEditFormSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  email: z
    .string()
    .email("Email inválido")
    .min(1, "Email é obrigatório"),
  phone: z
    .string()
    .min(10, "Telefone deve ter pelo menos 10 dígitos")
    .max(15, "Telefone deve ter no máximo 15 dígitos")
    .regex(/^[\d\s\-\(\)\+]+$/, "Telefone deve conter apenas números e símbolos válidos"),
});

// FORM - USER-EDIT PASSWORD CHANGE
export const PasswordChangeSchema = z.object({
  newPassword: z
    .string()
    .min(8, "Nova senha deve ter pelo menos 8 caracteres")
    .regex(/[a-zA-Z]/, "Senha deve conter pelo menos uma letra")
    .regex(/[0-9]/, "Senha deve conter pelo menos um número"),
  confirmPassword: z
    .string()
    .min(1, "Confirmação de senha é obrigatória"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"],
});

export type SignInFormData = z.infer<typeof SignInFormSchema>;
export type PreRegisterFormData = z.infer<typeof preRegisterSchema>;
export type CompleteRegisterFormData = z.infer<typeof completeRegisterSchema>;
export type UserEditFormData = z.infer<typeof UserEditFormSchema>;
export type PasswordChangeFormData = z.infer<typeof PasswordChangeSchema>;

// export type FormState =
//   | {
//       errors?: {
//         email?: string[];
//         password?: string[];
//       };
//       message?: string;
//     }
//   | undefined;
