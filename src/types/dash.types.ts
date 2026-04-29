export type ChartType = "line" | "bar_v" | "bar_h" | "pie";
export type Dominio = "faturamento" | "financeiro" | "estoque";
export type Periodo = "S" | "M" | "T";

export interface ChartSeries {
  name: string;
  data: number[];
}

export interface ChartDataDto {
  chartType: ChartType;
  labels: string[];
  series: ChartSeries[];
}

// ── Grid ──────────────────────────────────────────────────────────────────────

export interface GridResponseDto<T> {
  total: number;
  page: number;
  limit: number;
  items: T[];
}

export interface FatPorClienteItem {
  idcnt: number;
  razao: string;
  docfed: string | null;
  qtdPedidos: number;
  valorTotal: number;
  ultimoPedidoEm: string;
  ticketMedio: number;
}

export interface FatPorProdutoItem {
  idprd: number;
  codigo: string;
  nome: string;
  unidade: string;
  qtdeTotal: number;
  valorTotal: number;
  precoMedio: number;
}

export interface FatPorVendedorItem {
  idvend: number;
  nomeVendedor: string;
  qtdPedidos: number;
  valorTotal: number;
  clientesUnicos: number;
  ticketMedio: number;
}

export interface FinReceberItem {
  idctarec: number;
  cliente: string;
  emissao: string;
  vencimento: string;
  pagamento: string | null;
  valor: number;
  valorpago: number;
  status: string;
}

export interface FinPagarItem {
  idpag: number;
  nrodoc: string;
  fornecedor: string;
  emissao: string;
  vencimentoMin: string;
  valortotal: number;
  valorPagoAcum: number;
  status: string;
}

export interface FinMovimentoItem {
  idmov: number;
  dataemi: string;
  debcred: "C" | "D";
  especie: string;
  destino: string;
  valor: number;
  baixado: boolean;
  tborigem: string;
}

export interface EstLancamentoItem {
  idmov: number;
  dthrestoque: string;
  tipo: "E" | "S";
  produto: string;
  sku: string;
  qtde: number;
  custo: number;
  origem: string;
}

export interface EstPorProdutoItem {
  idprd: number;
  codigo: string;
  nome: string;
  unidade: string;
  saldoatu: number;
  saldomin: number;
  saldomax: number;
  customedio: number;
  valorEstoque: number;
}

export interface EstPorFornecedorItem {
  idcnt: number;
  razao: string;
  docfed: string | null;
  qtdCompras: number;
  valorTotal: number;
  ultimaCompraEm: string;
}

export type GridItem =
  | FatPorClienteItem
  | FatPorProdutoItem
  | FatPorVendedorItem
  | FinReceberItem
  | FinPagarItem
  | FinMovimentoItem
  | EstLancamentoItem
  | EstPorProdutoItem
  | EstPorFornecedorItem;
