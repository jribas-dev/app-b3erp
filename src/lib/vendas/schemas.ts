import { z } from "zod";

/**
 * Schemas zod para validação no boundary das server actions de vendas.
 * Refletem exatamente os tipos em src/types/vendas.types.ts — quando o
 * tipo mudar, atualizar o schema correspondente.
 *
 * Mensagens em pt-BR para chegarem legíveis ao usuário final via
 * `ActionResult.error`.
 */

const idPositive = z.number().int().positive();

export const NovoPedidoPayloadSchema = z.object({
  rctipo: z.string().min(1, "Tipo é obrigatório"),
  rcfat: z.string().min(1, "Faturamento é obrigatório"),
  idCli: idPositive,
  idOper: idPositive,
  idemp: idPositive,
});

export const AdicionarItemPayloadSchema = z.object({
  idProd: idPositive,
  qtde: z.number().positive("Quantidade deve ser maior que zero"),
  vunit: z.number().nonnegative("Valor unitário não pode ser negativo"),
  custo: z.number().nonnegative("Custo não pode ser negativo"),
  cfop: z.string().min(1, "CFOP é obrigatório"),
  vST: z.number().nonnegative(),
  vIPI: z.number().nonnegative(),
  tabela: z.number().int().nonnegative(),
  obsprod: z.string().optional(),
});

export const FecharPedidoPayloadSchema = z.object({
  idForma: idPositive,
  idCond: idPositive,
  obsInter: z.string().optional(),
});

export const ClienteFormPayloadSchema = z.object({
  razao: z.string().min(2, "Razão social deve ter ao menos 2 caracteres"),
  fantasia: z.string().optional(),
  docfed: z.string().optional(),
  docest: z.string().optional(),
  email: z.string().optional(),
  emailnfe: z.string().optional(),
  emailcob: z.string().optional(),
  site: z.string().optional(),
  cep: z.string().optional(),
  endereco: z.string().optional(),
  nroend: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  uf: z.string().max(2, "UF deve ter 2 caracteres").optional(),
  fone: z.string().optional(),
  fone2: z.string().optional(),
  cel: z.string().optional(),
  obsvenda: z.string().optional(),
  idoper: idPositive.optional(),
  idvende: idPositive.optional(),
  tipopessoa: z.string().optional(),
});

export const ClienteFormPayloadPartialSchema = ClienteFormPayloadSchema.partial();
