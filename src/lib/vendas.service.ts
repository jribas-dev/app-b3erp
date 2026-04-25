"use server";

import { cookies } from "next/headers";
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
} from "@/types/vendas.types";

async function getAuthTokens() {
  const cookieStore = await cookies();
  return {
    accessToken: cookieStore.get("accessToken")?.value,
  };
}

export async function getEmitentesAction(): Promise<{
  success: boolean;
  data?: Emitente[];
  error?: string;
}> {
  try {
    const apiUrl = process.env.BACKEND_URL;
    if (!apiUrl) throw new Error("URL da API não configurada");

    const { accessToken } = await getAuthTokens();
    if (!accessToken) return { success: false, error: "Token de acesso não encontrado" };

    const response = await fetch(`${apiUrl}/tenant/emitentes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
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
    const apiUrl = process.env.BACKEND_URL;
    if (!apiUrl) throw new Error("URL da API não configurada");

    const { accessToken } = await getAuthTokens();
    if (!accessToken) return { success: false, error: "Token de acesso não encontrado" };

    const response = await fetch(`${apiUrl}/b3vendas/operacoes?idemp=${idemp}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
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
    const apiUrl = process.env.BACKEND_URL;
    if (!apiUrl) throw new Error("URL da API não configurada");

    const { accessToken } = await getAuthTokens();
    if (!accessToken) return { success: false, error: "Token de acesso não encontrado" };

    const response = await fetch(
      `${apiUrl}/tenant/cfg?param=${encodeURIComponent(param)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
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
    const apiUrl = process.env.BACKEND_URL;
    if (!apiUrl) throw new Error("URL da API não configurada");

    const { accessToken } = await getAuthTokens();
    if (!accessToken) return { success: false, error: "Token de acesso não encontrado" };

    const response = await fetch(
      `${apiUrl}/b3vendas/clientes/buscar?q=${encodeURIComponent(q)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      }
    );

    console.log("Resposta da API de busca de clientes:", response);

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
    const apiUrl = process.env.BACKEND_URL;
    if (!apiUrl) throw new Error("URL da API não configurada");

    const { accessToken } = await getAuthTokens();
    if (!accessToken) return { success: false, error: "Token de acesso não encontrado" };

    const response = await fetch(`${apiUrl}/b3vendas/clientes/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
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
    const apiUrl = process.env.BACKEND_URL;
    if (!apiUrl) throw new Error("URL da API não configurada");

    const { accessToken } = await getAuthTokens();
    if (!accessToken) return { success: false, error: "Token de acesso não encontrado" };

    const response = await fetch(`${apiUrl}/b3vendas/pedidos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
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
    const apiUrl = process.env.BACKEND_URL;
    if (!apiUrl) throw new Error("URL da API não configurada");

    const { accessToken } = await getAuthTokens();
    if (!accessToken) return { success: false, error: "Token de acesso não encontrado", status: 401 };

    const response = await fetch(`${apiUrl}/b3vendas/pedidos/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
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
    const apiUrl = process.env.BACKEND_URL;
    if (!apiUrl) throw new Error("URL da API não configurada");

    const { accessToken } = await getAuthTokens();
    if (!accessToken) return { success: false, error: "Token de acesso não encontrado" };

    const response = await fetch(
      `${apiUrl}/b3vendas/produtos/buscar?q=${encodeURIComponent(q)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
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
    const apiUrl = process.env.BACKEND_URL;
    if (!apiUrl) throw new Error("URL da API não configurada");

    const { accessToken } = await getAuthTokens();
    if (!accessToken) return { success: false, error: "Token de acesso não encontrado" };

    const response = await fetch(
      `${apiUrl}/b3vendas/produtos/${idProd}/preco?idCli=${idCli}&idOper=${idOper}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
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
    const apiUrl = process.env.BACKEND_URL;
    if (!apiUrl) throw new Error("URL da API não configurada");

    const { accessToken } = await getAuthTokens();
    if (!accessToken) return { success: false, error: "Token de acesso não encontrado" };

    const response = await fetch(`${apiUrl}/b3vendas/produtos/${idProd}/calc-imposto`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
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
    const apiUrl = process.env.BACKEND_URL;
    if (!apiUrl) throw new Error("URL da API não configurada");

    const { accessToken } = await getAuthTokens();
    if (!accessToken) return { success: false, error: "Token de acesso não encontrado" };

    const response = await fetch(`${apiUrl}/b3vendas/pedidos/${idPedido}/itens`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
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
    const apiUrl = process.env.BACKEND_URL;
    if (!apiUrl) throw new Error("URL da API não configurada");

    const { accessToken } = await getAuthTokens();
    if (!accessToken) return { success: false, error: "Token de acesso não encontrado" };

    const response = await fetch(`${apiUrl}/b3vendas/pedidos/${idPedido}/itens/${seq}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
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
    const apiUrl = process.env.BACKEND_URL;
    if (!apiUrl) throw new Error("URL da API não configurada");

    const { accessToken } = await getAuthTokens();
    if (!accessToken) return { success: false, error: "Token de acesso não encontrado" };

    const response = await fetch(
      `${apiUrl}/b3vendas/pedidos/${idPedido}/formas-disponiveis`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
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
    const apiUrl = process.env.BACKEND_URL;
    if (!apiUrl) throw new Error("URL da API não configurada");

    const { accessToken } = await getAuthTokens();
    if (!accessToken) return { success: false, error: "Token de acesso não encontrado" };

    const response = await fetch(
      `${apiUrl}/b3vendas/pedidos/${idPedido}/condicoes-disponiveis`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
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
    const apiUrl = process.env.BACKEND_URL;
    if (!apiUrl) throw new Error("URL da API não configurada");

    const { accessToken } = await getAuthTokens();
    if (!accessToken) return { success: false, error: "Token de acesso não encontrado" };

    const response = await fetch(`${apiUrl}/b3vendas/pedidos/editaveis?idemp=${idemp}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
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
    const apiUrl = process.env.BACKEND_URL;
    if (!apiUrl) throw new Error("URL da API não configurada");

    const { accessToken } = await getAuthTokens();
    if (!accessToken) return { success: false, error: "Token de acesso não encontrado" };

    const response = await fetch(`${apiUrl}/b3vendas/pedidos/fechados?idemp=${idemp}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
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
    const apiUrl = process.env.BACKEND_URL;
    if (!apiUrl) throw new Error("URL da API não configurada");

    const { accessToken } = await getAuthTokens();
    if (!accessToken) return { success: false, error: "Token de acesso não encontrado" };

    const response = await fetch(`${apiUrl}/b3vendas/pedidos/${idPedido}/fechar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
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