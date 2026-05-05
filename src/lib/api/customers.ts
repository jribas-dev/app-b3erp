import {
  atualizarClienteAction,
  buscarCepAction,
  buscarClientesAction,
  criarClienteAction,
  getClienteAction,
  getClientesRedeSPAction,
} from "@/lib/vendas/clientes.service";

// Agrupa as server actions de cliente em uma fachada coesa.
// Hooks consomem `customersApi.search()` em vez de importar 6 funções soltas.
export const customersApi = {
  search: buscarClientesAction,
  getById: getClienteAction,
  create: criarClienteAction,
  update: atualizarClienteAction,
  listRedeSP: getClientesRedeSPAction,
  lookupCep: buscarCepAction,
};
