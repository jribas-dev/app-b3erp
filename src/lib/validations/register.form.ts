import { z } from "zod";

export const preRegisterSchema = z.object({
  email: z.string().email("Email inválido").min(1, "Email é obrigatório"),
  token: z.string().min(1, "Token é obrigatório"),
});

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

export type PreRegisterFormData = z.infer<typeof preRegisterSchema>;
export type CompleteRegisterFormData = z.infer<typeof completeRegisterSchema>;
