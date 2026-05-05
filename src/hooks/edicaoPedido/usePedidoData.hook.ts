"use client";

import { useCallback, useEffect, useState } from "react";

import { pedidosApi } from "@/lib/api";
import type { PedidoDetalhe } from "@/lib/vendas/schemas";

export type PedidoLoadError = { status?: number; message: string } | null;

export function usePedidoData(idPedido: number | null) {
  const [pedido, setPedido] = useState<PedidoDetalhe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<PedidoLoadError>(null);

  const reload = useCallback(async () => {
    if (!idPedido) {
      setLoadError({ message: "ID do pedido não informado" });
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setLoadError(null);
    const result = await pedidosApi.getById(idPedido);
    if (result.success) {
      setPedido({ ...result.data, itens: result.data.itens ?? [] });
    } else {
      setLoadError({
        status: result.status,
        message: result.error || "Erro ao carregar pedido",
      });
    }
    setIsLoading(false);
  }, [idPedido]);

  useEffect(() => {
    reload();
  }, [reload]);

  const isFiscal = pedido?.fiscal === "F";
  const isAberto = pedido?.tipo === "O";

  return {
    pedido,
    setPedido,
    isLoading,
    loadError,
    reload,
    isFiscal,
    isAberto,
  };
}
