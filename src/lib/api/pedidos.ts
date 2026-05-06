import {
  adicionarItemAction,
  criarPedidoAction,
  fecharPedidoAction,
  getPedidoAction,
  getPedidosEditaveisAction,
  getPedidosFechadosAction,
  removerItemAction,
} from "@/lib/vendas/pedidos";

export const pedidosApi = {
  create: criarPedidoAction,
  getById: getPedidoAction,
  listEditaveis: getPedidosEditaveisAction,
  listFechados: getPedidosFechadosAction,
  fechar: fecharPedidoAction,
  addItem: adicionarItemAction,
  removeItem: removerItemAction,
};
