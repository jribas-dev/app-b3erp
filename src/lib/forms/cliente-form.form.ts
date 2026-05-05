import { z } from "zod";
import type { ClienteFormPayload } from "@/types/vendas.types";
import { isValidCPF } from "@/lib/validation/cpf";
import { isValidCNPJ } from "@/lib/validation/cnpj";

export const ClienteFormSchema = z.object({
  razao: z
    .string()
    .trim()
    .min(2, "Razão social deve ter ao menos 2 caracteres"),
  fantasia: z.string(),
  docfedDisplay: z.string().refine(
    (v) => {
      const raw = v.replace(/\D/g, "");
      if (!raw) return true;
      if (raw.length === 11) return isValidCPF(raw);
      if (raw.length === 14) return isValidCNPJ(raw);
      return false;
    },
    { message: "CPF/CNPJ inválido" },
  ),
  docest: z.string(),
  email: z.string(),
  emailnfe: z.string(),
  emailcob: z.string(),
  site: z.string(),
  cepDisplay: z.string(),
  endereco: z.string(),
  nroend: z.string(),
  bairro: z.string(),
  cidade: z.string(),
  uf: z.string().refine((v) => v.length <= 2, {
    message: "UF deve ter 2 caracteres",
  }),
  fone: z.string(),
  fone2: z.string(),
  cel: z.string(),
  obsvenda: z.string(),
  idoper: z.string(),
  idvende: z.string(),
  tipopessoa: z.string(),
});

export type ClienteFormValues = z.infer<typeof ClienteFormSchema>;

export const EMPTY_CLIENTE_FORM: ClienteFormValues = {
  razao: "",
  fantasia: "",
  docfedDisplay: "",
  docest: "",
  email: "",
  emailnfe: "",
  emailcob: "",
  site: "",
  cepDisplay: "",
  endereco: "",
  nroend: "",
  bairro: "",
  cidade: "",
  uf: "",
  fone: "",
  fone2: "",
  cel: "",
  obsvenda: "",
  idoper: "",
  idvende: "",
  tipopessoa: "F",
};

export function toClienteFormPayload(v: ClienteFormValues): ClienteFormPayload {
  const trim = (s: string) => s.trim();
  return {
    razao: trim(v.razao),
    ...(trim(v.fantasia) && { fantasia: trim(v.fantasia) }),
    ...(v.docfedDisplay && { docfed: v.docfedDisplay.replace(/\D/g, "") }),
    ...(trim(v.docest) && { docest: trim(v.docest) }),
    ...(trim(v.email) && { email: trim(v.email) }),
    ...(trim(v.emailnfe) && { emailnfe: trim(v.emailnfe) }),
    ...(trim(v.emailcob) && { emailcob: trim(v.emailcob) }),
    ...(trim(v.site) && { site: trim(v.site) }),
    ...(v.cepDisplay && { cep: v.cepDisplay.replace(/\D/g, "") }),
    ...(trim(v.endereco) && { endereco: trim(v.endereco) }),
    ...(trim(v.nroend) && { nroend: trim(v.nroend) }),
    ...(trim(v.bairro) && { bairro: trim(v.bairro) }),
    ...(trim(v.cidade) && { cidade: trim(v.cidade) }),
    ...(trim(v.uf) && { uf: trim(v.uf).toUpperCase().slice(0, 2) }),
    ...(v.fone && { fone: v.fone }),
    ...(v.fone2 && { fone2: v.fone2 }),
    ...(v.cel && { cel: v.cel }),
    ...(trim(v.obsvenda) && { obsvenda: trim(v.obsvenda) }),
    ...(v.idoper && { idoper: parseInt(v.idoper, 10) }),
    ...(v.idvende && { idvende: parseInt(v.idvende, 10) }),
    ...(v.tipopessoa && { tipopessoa: v.tipopessoa }),
  };
}
