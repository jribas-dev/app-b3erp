import { z } from "zod";
import { email_def, name_def, password_def, phone_def } from "./default.field";

export const preRegisterSchema = z.object({
  email: email_def,
  token: z.string().min(3, "Token é obrigatório"),
});

export const completeRegisterSchema = z
  .object({
    name: name_def,
    phone: phone_def,
    password: password_def,
    passwordConfirm: password_def,
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "As senhas não conferem",
    path: ["passwordConfirm"],
  });

export type PreRegisterFormData = z.infer<typeof preRegisterSchema>;
export type CompleteRegisterFormData = z.infer<typeof completeRegisterSchema>;
