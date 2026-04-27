"use server";

import type {
  Emitente,
  Operacao,
  ClienteBusca,
  ClienteDetalhe,
  NovoPedidoPayload,
  PedidoCriado,
  TenantCfg,
  PedidoDetalhe,
  PedidoLista,
  ProdutoBusca,
  ProdutoPreco,
  ImpostoCalculado,
  AdicionarItemPayload,
  FormaPagamento,
  CondicaoPagamento,
  FecharPedidoPayload,
  ClienteRedeSP,
  ItemTabelaPrecos,
  MembroEquipe,
  MetricaChartResponse,
  ClienteInativo,
  ClienteFormPayload,
  ViaCepData,
} from "@/types/vendas.types";
import { fetchWithAuth } from "./api-client";

export async function getEmitentesAction(): Promise<{
  success: boolean;
  data?: Emitente[];
  error?: string;
}> {
  try {
    const response = await fetchWithAuth("/tenant/emitentes", {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return { success: false, error: error.message || "Erro ao buscar empresas" };
    }

    const data: Emitente[] = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Erro ao buscar emitentes:", error);
    return { success: false, error: error instanceof Error ? error.message : "Erro interno do servidor" };
  }
}

export async function getOperacoesAction(idemp: number): Promise<{
  success: boolean;
  data?: Operacao[];
  error?: string;
}> {
  try {
    const response = await fetchWithAuth(`/b3vendas/operacoes?idemp=${idemp}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return { success: false, error: error.message || "Erro ao buscar operações" };
    }

    const data: Operacao[] = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Erro ao buscar operações:", error);
    return { success: false, error: error instanceof Error ? error.message : "Erro interno do servidor" };
  }
}

export async function getTenantCfgAction(param: string): Promise<{
  success: boolean;
  data?: TenantCfg;
  error?: string;
}> {
  try {
    const response = await fetchWithAuth(
      `/tenant/cfg?param=${encodeURIComponent(param)}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    if (response.status === 404) {
      return { success: false };
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return { success: false, error: error.message || "Erro ao buscar configuração do tenant" };
    }

    const data: TenantCfg = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Erro ao buscar configuração do tenant:", error);
    return { success: false, error: error instanceof Error ? error.message : "Erro interno do servidor" };
  }
}

export async function buscarClientesAction(q: string): Promise<{
  success: boolean;
  data?: ClienteBusca[];
  error?: string;
}> {
  try {
    const response = await fetchWithAuth(
      `/b3vendas/clientes/buscar?q=${encodeURIComponent(q)}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return { success: false, error: error.message || "Erro ao buscar clientes" };
    }

    const data: ClienteBusca[] = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    return { success: false, error: error instanceof Error ? error.message : "Erro interno do servidor" };
  }
}

export async function getClienteAction(id: number): Promise<{
  success: boolean;
  data?: ClienteDetalhe;
  error?: string;
}> {
  try {
    const response = await fetchWithAuth(`/b3vendas/clientes/${id}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return { success: false, error: error.message || "Erro ao buscar cliente" };
    }

    const data: ClienteDetalhe = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Erro ao buscar cliente:", error);
    return { success: false, error: error instanceof Error ? error.message : "Erro interno do servidor" };
  }
}

export async function criarPedidoAction(payload: NovoPedidoPayload): Promise<{
  success: boolean;
  data?: PedidoCriado;
  error?: string;
}> {
  try {
    const response = await fetchWithAuth("/b3vendas/pedidos", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return { success: false, error: error.message || "Erro ao criar pedido" };
    }

    const data: PedidoCriado = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    return { success: false, error: error instanceof Error ? error.message : "Erro interno do servidor" };
  }
}

export async function getPedidoAction(id: number): Promise<{
  success: boolean;
  data?: PedidoDetalhe;
  error?: string;
  status?: number;
}> {
  try {
    const response = await fetchWithAuth(`/b3vendas/pedidos/${id}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return {
        success: false,
        status: response.status,
        error: error.message || "Erro ao buscar pedido",
      };
    }

    const data: PedidoDetalhe = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Erro ao buscar pedido:", error);
    return { success: false, error: error instanceof Error ? error.message : "Erro interno do servidor" };
  }
}

export async function buscarProdutosAction(q: string): Promise<{
  success: boolean;
  data?: ProdutoBusca[];
  error?: string;
}> {
  try {
    const response = await fetchWithAuth(
      `/b3vendas/produtos/buscar?q=${encodeURIComponent(q)}`,
      {
        method: "GET",
        cache: "no-store",
      },
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return { success: false, error: error.message || "Erro ao buscar produtos" };
    }

    const data: ProdutoBusca[] = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return { success: false, error: error instanceof Error ? error.message : "Erro interno do servidor" };
  }
}

export async function getProdutoPrecoAction(
  idProd: number,
  idCli: number,
  idOper: number,
): Promise<{ success: boolean; data?: ProdutoPreco; error?: string }> {
  try {
    const response = await fetchWithAuth(
      `/b3vendas/produtos/${idProd}/preco?idCli=${idCli}&idOper=${idOper}`,
      {
        method: "GET",
        cache: "no-store",
      },
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return { success: false, error: error.message || "Erro ao buscar preço do produto" };
    }

    const data: ProdutoPreco = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Erro ao buscar preço do produto:", error);
    return { success: false, error: error instanceof Error ? error.message : "Erro interno do servidor" };
  }
}

export async function calcImpostoAction(
  idProd: number,
  subtotal: number,
  idOper: number,
): Promise<{ success: boolean; data?: ImpostoCalculado; error?: string }> {
  try {
    const response = await fetchWithAuth(`/b3vendas/produtos/${idProd}/calc-imposto`, {
      method: "POST",
      body: JSON.stringify({ subtotal, idOper }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return { success: false, error: error.message || "Erro ao calcular impostos" };
    }

    const data: ImpostoCalculado = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Erro ao calcular impostos:", error);
    return { success: false, error: error instanceof Error ? error.message : "Erro interno do servidor" };
  }
}

export async function adicionarItemAction(
  idPedido: number,
  payload: AdicionarItemPayload,
): Promise<{ success: boolean; data?: PedidoDetalhe; error?: string }> {
  try {
    const response = await fetchWithAuth(`/b3vendas/pedidos/${idPedido}/itens`, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return { success: false, error: error.message || "Erro ao adicionar item" };
    }

    const data: PedidoDetalhe = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Erro ao adicionar item:", error);
    return { success: false, error: error instanceof Error ? error.message : "Erro interno do servidor" };
  }
}

export async function removerItemAction(
  idPedido: number,
  seq: number,
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetchWithAuth(`/b3vendas/pedidos/${idPedido}/itens/${seq}`, {
      method: "DELETE",
    });

    if (!response.ok && response.status !== 204) {
      const error = await response.json().catch(() => ({}));
      return { success: false, error: error.message || "Erro ao remover item" };
    }

    return { success: true };
  } catch (error) {
    console.error("Erro ao remover item:", error);
    return { success: false, error: error instanceof Error ? error.message : "Erro interno do servidor" };
  }
}

export async function getFormasPagamentoAction(
  idPedido: number,
): Promise<{ success: boolean; data?: FormaPagamento[]; error?: string }> {
  try {
    const response = await fetchWithAuth(
      `/b3vendas/pedidos/${idPedido}/formas-disponiveis`,
      {
        method: "GET",
        cache: "no-store",
      },
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return { success: false, error: error.message || "Erro ao buscar formas de pagamento" };
    }

    const data: FormaPagamento[] = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Erro ao buscar formas de pagamento:", error);
    return { success: false, error: error instanceof Error ? error.message : "Erro interno do servidor" };
  }
}

export async function getCondicoesPagamentoAction(
  idPedido: number,
): Promise<{ success: boolean; data?: CondicaoPagamento[]; error?: string }> {
  try {
    const response = await fetchWithAuth(
      `/b3vendas/pedidos/${idPedido}/condicoes-disponiveis`,
      {
        method: "GET",
        cache: "no-store",
      },
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return { success: false, error: error.message || "Erro ao buscar condições de pagamento" };
    }

    const data: CondicaoPagamento[] = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Erro ao buscar condições de pagamento:", error);
    return { success: false, error: error instanceof Error ? error.message : "Erro interno do servidor" };
  }
}

export async function getPedidosEditaveisAction(idemp: number): Promise<{
  success: boolean;
  data?: PedidoLista[];
  error?: string;
}> {
  try {
    const response = await fetchWithAuth(`/b3vendas/pedidos/editaveis?idemp=${idemp}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return { success: false, error: error.message || "Erro ao buscar pedidos em aberto" };
    }

    const data: PedidoLista[] = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Erro ao buscar pedidos editáveis:", error);
    return { success: false, error: error instanceof Error ? error.message : "Erro interno do servidor" };
  }
}

export async function getPedidosFechadosAction(idemp: number): Promise<{
  success: boolean;
  data?: PedidoLista[];
  error?: string;
}> {
  try {
    const response = await fetchWithAuth(`/b3vendas/pedidos/fechados?idemp=${idemp}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return { success: false, error: error.message || "Erro ao buscar histórico de pedidos" };
    }

    const data: PedidoLista[] = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Erro ao buscar pedidos fechados:", error);
    return { success: false, error: error instanceof Error ? error.message : "Erro interno do servidor" };
  }
}

export async function fecharPedidoAction(
  idPedido: number,
  payload: FecharPedidoPayload,
): Promise<{ success: boolean; data?: PedidoDetalhe; error?: string }> {
  try {
    const response = await fetchWithAuth(`/b3vendas/pedidos/${idPedido}/fechar`, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return { success: false, error: error.message || "Erro ao fechar pedido" };
    }

    const data: PedidoDetalhe = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Erro ao fechar pedido:", error);
    return { success: false, error: error instanceof Error ? error.message : "Erro interno do servidor" };
  }
}

export async function getClientesRedeSPAction(): Promise<{
  success: boolean;
  data?: ClienteRedeSP[];
  error?: string;
}> {
  try {
    const response = await fetchWithAuth("/b3vendas/clientes/rede-sp", {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return { success: false, error: error.message || "Erro ao buscar clientes da rede SP" };
    }

    const data: ClienteRedeSP[] = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Erro ao buscar clientes rede SP:", error);
    return { success: false, error: error instanceof Error ? error.message : "Erro interno do servidor" };
  }
}

export async function getEquipeAction(): Promise<{
  success: boolean;
  data?: MembroEquipe[];
  error?: string;
}> {
  try {
    const response = await fetchWithAuth("/b3vendas/equipe", {
      method: "GET",
      cache: "no-store",
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return { success: false, error: error.message || "Erro ao buscar equipe" };
    }
    const data: MembroEquipe[] = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Erro ao buscar equipe:", error);
    return { success: false, error: error instanceof Error ? error.message : "Erro interno do servidor" };
  }
}

export async function getVendasSemanaisAction(): Promise<{
  success: boolean;
  data?: MetricaChartResponse;
  error?: string;
}> {
  try {
    const response = await fetchWithAuth("/b3vendas/metricas/vendas-semanais", {
      method: "GET",
      cache: "no-store",
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return { success: false, error: error.message || "Erro ao buscar vendas semanais" };
    }
    const data: MetricaChartResponse = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Erro ao buscar vendas semanais:", error);
    return { success: false, error: error instanceof Error ? error.message : "Erro interno do servidor" };
  }
}

export async function getVendasMensaisAction(): Promise<{
  success: boolean;
  data?: MetricaChartResponse;
  error?: string;
}> {
  try {
    const response = await fetchWithAuth("/b3vendas/metricas/vendas-mensais", {
      method: "GET",
      cache: "no-store",
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return { success: false, error: error.message || "Erro ao buscar vendas mensais" };
    }
    const data: MetricaChartResponse = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Erro ao buscar vendas mensais:", error);
    return { success: false, error: error instanceof Error ? error.message : "Erro interno do servidor" };
  }
}

export async function getTopClientesAtivosAction(): Promise<{
  success: boolean;
  data?: MetricaChartResponse;
  error?: string;
}> {
  try {
    const response = await fetchWithAuth("/b3vendas/metricas/top-clientes-ativos", {
      method: "GET",
      cache: "no-store",
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return { success: false, error: error.message || "Erro ao buscar top clientes" };
    }
    const data: MetricaChartResponse = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Erro ao buscar top clientes:", error);
    return { success: false, error: error instanceof Error ? error.message : "Erro interno do servidor" };
  }
}

export async function getClientesInativosAction(): Promise<{
  success: boolean;
  data?: ClienteInativo[];
  error?: string;
}> {
  try {
    const response = await fetchWithAuth("/b3vendas/metricas/clientes-inativos", {
      method: "GET",
      cache: "no-store",
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return { success: false, error: error.message || "Erro ao buscar clientes inativos" };
    }
    const data: ClienteInativo[] = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Erro ao buscar clientes inativos:", error);
    return { success: false, error: error instanceof Error ? error.message : "Erro interno do servidor" };
  }
}

export async function getTabelaPrecosAction(
  idOper: number,
  idCli: number,
): Promise<{ success: boolean; data?: ItemTabelaPrecos[]; error?: string }> {
  try {
    const response = await fetchWithAuth(
      `/b3vendas/clientes/tabela?idOper=${idOper}&idCli=${idCli}`,
      {
        method: "GET",
        cache: "no-store",
      },
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return { success: false, error: error.message || "Erro ao buscar tabela de preços" };
    }

    const data: ItemTabelaPrecos[] = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Erro ao buscar tabela de preços:", error);
    return { success: false, error: error instanceof Error ? error.message : "Erro interno do servidor" };
  }
}

export async function criarClienteAction(
  payload: ClienteFormPayload,
): Promise<{ success: boolean; data?: ClienteDetalhe; error?: string }> {
  try {
    const response = await fetchWithAuth("/b3vendas/clientes", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return { success: false, error: error.message || "Erro ao criar cliente" };
    }

    const data: ClienteDetalhe = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Erro ao criar cliente:", error);
    return { success: false, error: error instanceof Error ? error.message : "Erro interno do servidor" };
  }
}

export async function atualizarClienteAction(
  id: number,
  payload: Partial<ClienteFormPayload>,
): Promise<{ success: boolean; data?: ClienteDetalhe; error?: string }> {
  try {
    const response = await fetchWithAuth(`/b3vendas/clientes/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      if (response.status === 403) {
        return { success: false, error: "Sem permissão para alterar este cliente" };
      }
      return { success: false, error: error.message || "Erro ao atualizar cliente" };
    }

    const data: ClienteDetalhe = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error);
    return { success: false, error: error instanceof Error ? error.message : "Erro interno do servidor" };
  }
}

export async function getEquipeSemEquipeAction(): Promise<{
  success: boolean;
  data?: MembroEquipe[];
  error?: string;
}> {
  try {
    const response = await fetchWithAuth("/b3vendas/equipe/sem-equipe", {
      method: "GET",
      cache: "no-store",
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return { success: false, error: error.message || "Erro ao buscar vendedores disponíveis" };
    }
    const data: MembroEquipe[] = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Erro ao buscar equipe sem equipe:", error);
    return { success: false, error: error instanceof Error ? error.message : "Erro interno do servidor" };
  }
}

export async function adicionarMembroEquipeAction(idcntliderado: number): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const response = await fetchWithAuth("/b3vendas/equipe", {
      method: "POST",
      body: JSON.stringify({ idcntliderado }),
    });
    if (response.status === 201) return { success: true };
    const error = await response.json().catch(() => ({}));
    if (response.status === 409) return { success: false, error: "Vendedor já pertence a esta equipe" };
    if (response.status === 400) return { success: false, error: error.message || "Operação inválida" };
    return { success: false, error: error.message || "Erro ao adicionar membro" };
  } catch (error) {
    console.error("Erro ao adicionar membro à equipe:", error);
    return { success: false, error: error instanceof Error ? error.message : "Erro interno do servidor" };
  }
}

export async function removerMembroEquipeAction(id: number): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const response = await fetchWithAuth(`/b3vendas/equipe/${id}`, {
      method: "DELETE",
    });
    if (response.status === 204 || response.ok) return { success: true };
    if (response.status === 404) return { success: false, error: "Vínculo não encontrado nesta equipe" };
    const error = await response.json().catch(() => ({}));
    return { success: false, error: error.message || "Erro ao remover membro" };
  } catch (error) {
    console.error("Erro ao remover membro da equipe:", error);
    return { success: false, error: error instanceof Error ? error.message : "Erro interno do servidor" };
  }
}

export async function buscarCepAction(
  cep: string,
): Promise<{ success: boolean; data?: ViaCepData; error?: string }> {
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return { success: false, error: "CEP não encontrado" };
    }

    const data: ViaCepData = await response.json();
    if (data.erro) {
      return { success: false, error: "CEP não encontrado" };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Erro ao buscar CEP:", error);
    return { success: false, error: "Erro ao consultar CEP" };
  }
}
