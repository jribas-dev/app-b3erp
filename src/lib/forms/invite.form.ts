import { z } from "zod";
import { email_def } from "./default.field";

export const RoleBackEnum = z.enum([
  "admin",
  "supervisor",
  "user",
  "notallow",
]);

export const RoleFrontEnum = z.enum([
  "admin",
  "supersaler",
  "saler",
  "inventory",
  "buyer",
  "notallow",
]);

export const TipoUsuarioEnum = z.enum(["interno", "externo"]);

export type RoleBackValue = z.infer<typeof RoleBackEnum>;
export type RoleFrontValue = z.infer<typeof RoleFrontEnum>;
export type TipoUsuarioValue = z.infer<typeof TipoUsuarioEnum>;

export const ROLE_BACK_OPTIONS: ReadonlyArray<{
  value: RoleBackValue;
  label: string;
}> = [
  { value: "admin", label: "Administrador" },
  { value: "supervisor", label: "Supervisor" },
  { value: "user", label: "Usuário" },
  { value: "notallow", label: "Sem acesso" },
];

export const ROLE_FRONT_OPTIONS: ReadonlyArray<{
  value: RoleFrontValue;
  label: string;
}> = [
  { value: "admin", label: "Administrativo" },
  { value: "supersaler", label: "Gerente de Vendas" },
  { value: "saler", label: "Vendedor" },
  { value: "buyer", label: "Comprador" },
  { value: "inventory", label: "Estoque" },
  { value: "notallow", label: "Sem acesso" },
];

export const TIPO_USUARIO_OPTIONS: ReadonlyArray<{
  value: TipoUsuarioValue;
  label: string;
}> = [
  { value: "interno", label: "Interno" },
  { value: "externo", label: "Externo" },
];

export const InviteFormSchema = z
  .object({
    email: email_def,
    tipo: TipoUsuarioEnum,
    roleBack: RoleBackEnum,
    roleFront: z
      .array(RoleFrontEnum)
      .min(1, "Selecione pelo menos uma função"),
    idemp: z.number().int().nullable().optional(),
    idBackendUser: z.number().int().nullable().optional(),
  })
  .refine(
    (d) =>
      !(d.roleFront.includes("saler") && d.roleFront.includes("supersaler")),
    {
      message: "Vendedor e Gerente de Vendas não podem coexistir",
      path: ["roleFront"],
    }
  )
  .refine((d) => d.tipo === "externo" || d.roleBack !== "notallow", {
    message: "Usuários internos exigem uma função no BackOffice",
    path: ["roleBack"],
  })
  .refine(
    (d) => d.roleBack === "notallow" || typeof d.idBackendUser === "number",
    {
      message: "Informe o usuário do BackOffice para a função selecionada",
      path: ["idBackendUser"],
    }
  );

export type InviteFormValues = z.infer<typeof InviteFormSchema>;
