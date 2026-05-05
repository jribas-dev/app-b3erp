import { z } from "zod";
import { password_def } from "./default.field";

export const resetPasswordSchema = z
  .object({
    password: password_def,
    passwordConfirm: password_def,
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "As senhas não conferem",
    path: ["passwordConfirm"],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
