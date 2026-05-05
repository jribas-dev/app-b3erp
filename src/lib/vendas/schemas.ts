import { z } from "zod";

/**
 * Source-of-truth para tipos e schemas do domínio Vendas.
 *
 * Os tipos TS são derivados via `z.infer<typeof XSchema>` — não há definição
 * paralela em outro arquivo. Quando uma entidade muda, edite o schema aqui e
 * o tipo é atualizado automaticamente.
 *
 * Schemas que servem como `inputSchema` em server actions têm mensagens em
 * pt-BR para chegarem legíveis ao usuário via `ActionResult.error`.
 */

// ─── Building blocks ────────────────────────────────────────────────────────

export const positiveIdSchema = z.number().int().positive();
const idOrNullSchema = positiveIdSchema.nullable();
const optionalString = z.string().optional();
const stringOrNull = z.string().nullable();
const stringOrNullable = z.string().nullable().optional();

// ─── Entidades ──────────────────────────────────────────────────────────────

export const EmitenteSchema = z.object({
  id: positiveIdSchema,
  nome: z.string(),
  docfed: z.string(),
});
export type Emitente = z.infer<typeof EmitenteSchema>;

export const OperacaoSchema = z.object({
  id: positiveIdSchema,
  operacao: z.string(),
  subtipo: z.string(),
  cfopnormal: z.string(),
  cfopst: z.string(),
});
export type Operacao = z.infer<typeof OperacaoSchema>;

export const TenantCfgSchema = z.object({
  valor: z.string(),
  descricao: z.string().nullable(),
});
export type TenantCfg = z.infer<typeof TenantCfgSchema>;

export const ClienteBuscaSchema = z.object({
  id: positiveIdSchema,
  razao: z.string(),
  display: z.string(),
});
export type ClienteBusca = z.infer<typeof ClienteBuscaSchema>;

export const ClienteDetalheSchema = z.object({
  id: positiveIdSchema,
  tipopessoa: stringOrNullable,
  razao: z.string(),
  fantasia: stringOrNullable,
  docfed: stringOrNull,
  docformatado: stringOrNull,
  docest: stringOrNullable,
  fone: stringOrNull,
  fone2: stringOrNullable,
  cel: stringOrNull,
  endereco: stringOrNull,
  nroend: stringOrNull,
  bairro: stringOrNull,
  cidade: stringOrNull,
  uf: stringOrNull,
  cep: stringOrNullable,
  obsvenda: stringOrNull,
  idoper: idOrNullSchema,
  email: stringOrNull,
  emailnfe: stringOrNull,
  emailcob: stringOrNull,
  site: stringOrNullable,
  idvende: positiveIdSchema.nullable().optional(),
});
export type ClienteDetalhe = z.infer<typeof ClienteDetalheSchema>;

export const ViaCepDataSchema = z.object({
  logradouro: z.string(),
  bairro: z.string(),
  localidade: z.string(),
  uf: z.string(),
  erro: z.boolean().optional(),
});
export type ViaCepData = z.infer<typeof ViaCepDataSchema>;

export const PedidoCriadoSchema = z.object({
  id: positiveIdSchema,
  tipo: z.string(),
  idcli: positiveIdSchema,
  razaoCliente: z.string(),
  dthremissao: z.string(),
  vlrtotal: z.number(),
});
export type PedidoCriado = z.infer<typeof PedidoCriadoSchema>;

export const PedidoItemSchema = z.object({
  seq: z.number().int(),
  idprod: positiveIdSchema,
  nomeProduto: z.string(),
  qtde: z.number(),
  unitario: z.number(),
  total: z.number(),
  cfop: stringOrNullable,
  vST: z.number().nullable().optional(),
  vIPI: z.number().nullable().optional(),
});
export type PedidoItem = z.infer<typeof PedidoItemSchema>;

export const PedidoDetalheSchema = z.object({
  id: positiveIdSchema,
  idcli: positiveIdSchema,
  razaoCliente: z.string(),
  idoper: positiveIdSchema,
  fiscal: z.string(),
  tipo: z.string(),
  rcfat: optionalString,
  rctipo: optionalString,
  dthremissao: optionalString,
  vlrbruto: z.number(),
  desconto: z.number(),
  acrescimo: z.number(),
  st: z.number(),
  ipi: z.number(),
  vlrtotal: z.number(),
  obsinter: stringOrNull,
  idForma: idOrNullSchema,
  idCond: idOrNullSchema,
  cliente: ClienteDetalheSchema.nullable().optional(),
  itens: z.array(PedidoItemSchema),
});
export type PedidoDetalhe = z.infer<typeof PedidoDetalheSchema>;

export const ProdutoBuscaSchema = z.object({
  id: positiveIdSchema,
  nome: z.string(),
  display: z.string(),
});
export type ProdutoBusca = z.infer<typeof ProdutoBuscaSchema>;

export const ProdutoPrecoSchema = z.object({
  cfop: z.string(),
  custo: z.number(),
  vunit: z.number(),
});
export type ProdutoPreco = z.infer<typeof ProdutoPrecoSchema>;

export const ImpostoCalculadoSchema = z.object({
  ipi: z.number(),
  st: z.number(),
  total: z.number(),
});
export type ImpostoCalculado = z.infer<typeof ImpostoCalculadoSchema>;

export const FormaPagamentoSchema = z.object({
  id: positiveIdSchema,
  nome: z.string(),
});
export type FormaPagamento = z.infer<typeof FormaPagamentoSchema>;

export const CondicaoPagamentoSchema = z.object({
  id: positiveIdSchema,
  nome: z.string(),
});
export type CondicaoPagamento = z.infer<typeof CondicaoPagamentoSchema>;

export const PedidoListaSchema = z.object({
  id: positiveIdSchema,
  idcli: positiveIdSchema,
  razaoCliente: z.string(),
  dthremissao: z.string(),
  tipo: z.string(),
  vlrtotal: z.number(),
});
export type PedidoLista = z.infer<typeof PedidoListaSchema>;

export const ClienteRedeSPSchema = z.object({
  id: positiveIdSchema,
  nome: z.string(),
  docfed: stringOrNull,
  email: stringOrNull,
  fone: stringOrNull,
  cel: stringOrNull,
  cidade: stringOrNull,
});
export type ClienteRedeSP = z.infer<typeof ClienteRedeSPSchema>;

export const ItemTabelaPrecosSchema = z.object({
  operacao: z.string(),
  nometab: z.string(),
  ufbase: z.string(),
  id: positiveIdSchema,
  codigo: stringOrNull,
  ref: stringOrNull,
  barras: stringOrNull,
  nome: z.string(),
  unidade: stringOrNull,
  venda: z.number(),
  ivast: z.number(),
  vicmsst: z.number(),
  ipisaliq: z.number(),
  vipi: z.number(),
});
export type ItemTabelaPrecos = z.infer<typeof ItemTabelaPrecosSchema>;

export const MembroEquipeSchema = z.object({
  id: positiveIdSchema,
  razao: z.string(),
  cel: stringOrNull,
  fax: stringOrNull,
  liderado: z.number().int(),
});
export type MembroEquipe = z.infer<typeof MembroEquipeSchema>;

export const ChartSeriesSchema = z.object({
  name: z.string(),
  data: z.array(z.number()),
});
export type ChartSeries = z.infer<typeof ChartSeriesSchema>;

export const MetricaChartResponseSchema = z.object({
  chartType: z.enum(["line", "bar_h"]),
  labels: z.array(z.string()),
  series: z.array(ChartSeriesSchema),
});
export type MetricaChartResponse = z.infer<typeof MetricaChartResponseSchema>;

export const ClienteInativoSchema = z.object({
  id: positiveIdSchema,
  nome: z.string(),
  docfed: stringOrNull,
  email: stringOrNull,
  fone: stringOrNull,
  cel: stringOrNull,
  cidade: stringOrNull,
  uf: stringOrNull,
  ultimaVenda: stringOrNull,
  idvende: positiveIdSchema,
});
export type ClienteInativo = z.infer<typeof ClienteInativoSchema>;

// ─── Payloads de server actions ──────────────────────────────────────────────

export const NovoPedidoPayloadSchema = z.object({
  rctipo: z.string().min(1, "Tipo é obrigatório"),
  rcfat: z.string().min(1, "Faturamento é obrigatório"),
  idCli: positiveIdSchema,
  idOper: positiveIdSchema,
  idemp: positiveIdSchema,
});
export type NovoPedidoPayload = z.infer<typeof NovoPedidoPayloadSchema>;

export const AdicionarItemPayloadSchema = z.object({
  idProd: positiveIdSchema,
  qtde: z.number().positive("Quantidade deve ser maior que zero"),
  vunit: z.number().nonnegative("Valor unitário não pode ser negativo"),
  custo: z.number().nonnegative("Custo não pode ser negativo"),
  cfop: z.string().min(1, "CFOP é obrigatório"),
  vST: z.number().nonnegative(),
  vIPI: z.number().nonnegative(),
  tabela: z.number().int().nonnegative(),
  obsprod: z.string().optional(),
});
export type AdicionarItemPayload = z.infer<typeof AdicionarItemPayloadSchema>;

export const FecharPedidoPayloadSchema = z.object({
  idForma: positiveIdSchema,
  idCond: positiveIdSchema,
  obsInter: z.string().optional(),
});
export type FecharPedidoPayload = z.infer<typeof FecharPedidoPayloadSchema>;

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
  idoper: positiveIdSchema.optional(),
  idvende: positiveIdSchema.optional(),
  tipopessoa: z.string().optional(),
});
export type ClienteFormPayload = z.infer<typeof ClienteFormPayloadSchema>;

export const ClienteFormPayloadPartialSchema =
  ClienteFormPayloadSchema.partial();
