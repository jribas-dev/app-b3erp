"use client";

import { useCallback, useState } from "react";

import { pedidosApi } from "@/lib/api";

import { useFechamento } from "./edicaoPedido/useFechamento.hook";
import { useImpostoCalc } from "./edicaoPedido/useImpostoCalc.hook";
import { usePedidoData } from "./edicaoPedido/usePedidoData.hook";
import { useProdutoSearch } from "./edicaoPedido/useProdutoSearch.hook";

// Orquestrador da edição de pedido. Compõe sub-hooks focados (carregamento
// do pedido, busca de produto, cálculo de imposto, fechamento) e adiciona a
// lógica de adicionar/remover item — que cruza fronteiras entre eles.
export function useEditarPedido(idPedido: number | null) {
  const data = usePedidoData(idPedido);
  const search = useProdutoSearch(data.pedido);
  const imposto = useImpostoCalc({
    pedido: data.pedido,
    selectedProduto: search.selectedProduto,
    preco: search.preco,
    qtdeNum: search.qtdeNum,
    precoNum: search.precoNum,
    subtotal: search.subtotal,
    isFiscal: data.isFiscal,
  });
  const fechamento = useFechamento({
    idPedido,
    pedido: data.pedido,
    onPedidoUpdated: data.setPedido,
  });

  const [isAddingItem, setIsAddingItem] = useState(false);
  const [removingSeq, setRemovingSeq] = useState<number | null>(null);

  const canAddItem = !!(
    data.pedido &&
    data.isAberto &&
    search.selectedProduto &&
    search.preco &&
    search.qtdeNum > 0 &&
    search.precoNum > 0 &&
    imposto.impostos &&
    !imposto.isCalcImposto &&
    !search.isLoadingPreco &&
    !isAddingItem
  );

  const onAdicionarItem = useCallback(async () => {
    const { pedido } = data;
    const { selectedProduto, preco, qtdeNum, precoNum } = search;
    const { impostos } = imposto;
    if (!pedido || !selectedProduto || !preco || !impostos) return;
    if (qtdeNum <= 0 || precoNum <= 0) return;

    setIsAddingItem(true);
    search.setAddError(null);
    try {
      const result = await pedidosApi.addItem(pedido.id, {
        idProd: selectedProduto.id,
        qtde: qtdeNum,
        vunit: precoNum,
        custo: preco.custo,
        cfop: preco.cfop,
        vST: impostos.st,
        vIPI: impostos.ipi,
        tabela: 0,
      });
      if (result.success) {
        const reload = await pedidosApi.getById(pedido.id);
        if (reload.success) {
          data.setPedido({ ...reload.data, itens: reload.data.itens ?? [] });
        }
        search.resetProdutoForm();
        imposto.setImpostos(null);
      } else {
        search.setAddError(result.error || "Erro ao adicionar item");
      }
    } finally {
      setIsAddingItem(false);
    }
  }, [data, search, imposto]);

  const onRemoverItem = useCallback(
    async (seq: number) => {
      const { pedido } = data;
      if (!pedido) return;
      setRemovingSeq(seq);
      try {
        const result = await pedidosApi.removeItem(pedido.id, seq);
        if (result.success) {
          const reload = await pedidosApi.getById(pedido.id);
          if (reload.success) {
            data.setPedido({ ...reload.data, itens: reload.data.itens ?? [] });
          }
        } else {
          search.setAddError(result.error || "Erro ao remover item");
        }
      } finally {
        setRemovingSeq(null);
      }
    },
    [data, search],
  );

  return {
    pedido: data.pedido,
    isLoading: data.isLoading,
    loadError: data.loadError,
    reload: data.reload,

    isFiscal: data.isFiscal,
    isAberto: data.isAberto,

    produtoQuery: search.produtoQuery,
    onProdutoQueryChange: search.onProdutoQueryChange,
    produtoResults: search.produtoResults,
    isSearching: search.isSearching,
    showResults: search.showResults,
    setShowResults: search.setShowResults,
    selectedProduto: search.selectedProduto,
    onProdutoSelect: search.onProdutoSelect,
    preco: search.preco,
    isLoadingPreco: search.isLoadingPreco,
    precoEdit: search.precoEdit,
    setPrecoEdit: search.setPrecoEdit,
    precoNum: search.precoNum,
    qtde: search.qtde,
    setQtde: search.setQtde,
    qtdeNum: search.qtdeNum,
    subtotal: search.subtotal,

    impostos: imposto.impostos,
    isCalcImposto: imposto.isCalcImposto,

    canAddItem,
    isAddingItem,
    addError: search.addError,
    onAdicionarItem,

    removingSeq,
    onRemoverItem,

    loadFormasCondicoes: fechamento.loadFormasCondicoes,
    isLoadingFormas: fechamento.isLoadingFormas,
    formas: fechamento.formas,
    condicoes: fechamento.condicoes,
    fechamentoForm: fechamento.fechamentoForm,
    canFechar: fechamento.canFechar,
    isFechando: fechamento.isFechando,
    fecharError: fechamento.fecharError,
    onFechar: fechamento.onFechar,
    fechouOk: fechamento.fechouOk,
    setFechouOk: fechamento.setFechouOk,
  };
}
