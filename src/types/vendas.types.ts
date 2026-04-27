export interface Emitente {
  id: number;
  nome: string;
  docfed: string;
}

export interface Operacao {
  id: number;
  operacao: string;
  subtipo: string;
  cfopnormal: string;
  cfopst: string;
}

export interface TenantCfg {
  valor: string;
  descricao: string | null;
}

export interface ClienteBusca {
  id: number;
  razao: string;
  display: string;
}

export interface ClienteDetalhe {
  id: number;
  razao: string;
  docfed: string | null;
  docformatado: string | null;
  fone: string | null;
  cel: string | null;
  endereco: string | null;
  nroend: string | null;
  bairro: string | null;
  cidade: string | null;
  uf: string | null;
  obsvenda: string | null;
  idoper: number | null;
  email: string | null;
  emailnfe: string | null;
  emailcob: string | null;
}

export interface NovoPedidoPayload {
  rctipo: string;
  rcfat: string;
  idCli: number;
  idOper: number;
  idemp: number;
}

export interface PedidoCriado {
  id: number;
  tipo: string;
  idcli: number;
  razaoCliente: string;
  dthremissao: string;
  vlrtotal: number;
}

export interface PedidoItem {
  seq: number;
  idprod: number;
  nomeProduto: string;
  qtde: number;
  unitario: number;
  total: number;
  cfop?: string | null;
  vST?: number | null;
  vIPI?: number | null;
}

export interface PedidoDetalhe {
  id: number;
  idcli: number;
  razaoCliente: string;
  idoper: number;
  fiscal: string;
  tipo: string;
  rcfat?: string;
  rctipo?: string;
  dthremissao?: string;
  vlrbruto: number;
  desconto: number;
  acrescimo: number;
  st: number;
  ipi: number;
  vlrtotal: number;
  obsinter: string | null;
  idForma: number | null;
  idCond: number | null;
  cliente?: ClienteDetalhe | null;
  itens: PedidoItem[];
}

export interface ProdutoBusca {
  id: number;
  nome: string;
  display: string;
}

export interface ProdutoPreco {
  cfop: string;
  custo: number;
  vunit: number;
}

export interface ImpostoCalculado {
  ipi: number;
  st: number;
  total: number;
}

export interface AdicionarItemPayload {
  idProd: number;
  qtde: number;
  vunit: number;
  custo: number;
  cfop: string;
  vST: number;
  vIPI: number;
  tabela: number;
  obsprod?: string;
}

export interface FormaPagamento {
  id: number;
  nome: string;
}

export interface CondicaoPagamento {
  id: number;
  nome: string;
}

export interface FecharPedidoPayload {
  idForma: number;
  idCond: number;
  obsInter?: string;
}

export interface PedidoLista {
  id: number;
  idcli: number;
  razaoCliente: string;
  dthremissao: string;
  tipo: string;
  vlrtotal: number;
}

export interface ClienteRedeSP {
  id: number;
  nome: string;
  docfed: string | null;
  email: string | null;
  fone: string | null;
  cel: string | null;
  cidade: string | null;
}

export interface ItemTabelaPrecos {
  operacao: string;
  nometab: string;
  ufbase: string;
  id: number;
  codigo: string | null;
  ref: string | null;
  barras: string | null;
  nome: string;
  unidade: string | null;
  venda: number;
  ivast: number;
  vicmsst: number;
  ipisaliq: number;
  vipi: number;
}
