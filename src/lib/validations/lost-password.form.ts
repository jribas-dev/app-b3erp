import { z } from "zod";
import { email_def } from "./default.field";

export const LostPasswordFormSchema = z.object({
  email: email_def,
});

export type LostPasswordFormData = z.infer<typeof LostPasswordFormSchema>;
