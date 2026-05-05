import { z } from "zod";
import { email_def, name_def, password_def, phone_def } from "./default.field";

export const UserEditFormSchema = z.object({
  name: name_def,
  email: email_def,
  phone: phone_def,
});

export const PasswordChangeSchema = z
  .object({
    newPassword: password_def,
    confirmPassword: password_def,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Senhas não coincidem",
    path: ["confirmPassword"],
  });

export type UserEditFormData = z.infer<typeof UserEditFormSchema>;
export type PasswordChangeFormData = z.infer<typeof PasswordChangeSchema>;
