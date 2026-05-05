import {
  adicionarItemAction,
  removerItemAction,
} from "@/lib/vendas/pedido-itens.service";
import {
  criarPedidoAction,
  fecharPedidoAction,
  getPedidoAction,
  getPedidosEditaveisAction,
  getPedidosFechadosAction,
} from "@/lib/vendas/pedidos.service";

export const pedidosApi = {
  create: criarPedidoAction,
  getById: getPedidoAction,
  listEditaveis: getPedidosEditaveisAction,
  listFechados: getPedidosFechadosAction,
  fechar: fecharPedidoAction,
  addItem: adicionarItemAction,
  removeItem: removerItemAction,
};
