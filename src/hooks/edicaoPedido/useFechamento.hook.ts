"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import {
  EMPTY_FECHAMENTO_FORM,
  FechamentoFormSchema,
  toFecharPedidoPayload,
  type FechamentoFormValues,
} from "@/lib/forms/fechamento.form";
import { pagamentosApi, pedidosApi } from "@/lib/api";
import type {
  CondicaoPagamento,
  FormaPagamento,
  PedidoDetalhe,
} from "@/lib/vendas/schemas";

interface UseFechamentoArgs {
  idPedido: number | null;
  pedido: PedidoDetalhe | null;
  onPedidoUpdated: (pedido: PedidoDetalhe) => void;
}

export function useFechamento({
  idPedido,
  pedido,
  onPedidoUpdated,
}: UseFechamentoArgs) {
  const [formas, setFormas] = useState<FormaPagamento[]>([]);
  const [condicoes, setCondicoes] = useState<CondicaoPagamento[]>([]);
  const [isLoadingFormas, setIsLoadingFormas] = useState(false);
  const [fecharError, setFecharError] = useState<string | null>(null);
  const [fechouOk, setFechouOk] = useState(false);
  const [isFechando, setIsFechando] = useState(false);

  const form = useForm<FechamentoFormValues>({
    resolver: zodResolver(FechamentoFormSchema),
    defaultValues: EMPTY_FECHAMENTO_FORM,
    mode: "onChange",
  });

  const { reset } = form;

  useEffect(() => {
    if (!pedido) return;
    reset({
      idForma: pedido.idForma ? String(pedido.idForma) : "",
      idCond: pedido.idCond ? String(pedido.idCond) : "",
      obsInter: pedido.obsinter ?? "",
    });
  }, [pedido, reset]);

  const loadFormasCondicoes = useCallback(async () => {
    if (!idPedido) return;
    setIsLoadingFormas(true);
    try {
      const [fr, cr] = await Promise.all([
        pagamentosApi.getFormas(idPedido),
        pagamentosApi.getCondicoes(idPedido),
      ]);
      if (fr.success) setFormas(fr.data);
      if (cr.success) setCondicoes(cr.data);
    } finally {
      setIsLoadingFormas(false);
    }
  }, [idPedido]);

  const isAberto = pedido?.tipo === "O";
  const canFechar = !!(pedido && isAberto && !isFechando);

  const onFechar = async () => {
    if (!pedido || isFechando) return;
    setFecharError(null);

    // Sem mudanças: pula o POST e abre o diálogo diretamente.
    if (!form.formState.isDirty) {
      setFechouOk(true);
      return;
    }

    setIsFechando(true);
    try {
      const values = form.getValues();
      const result = await pedidosApi.fechar(
        pedido.id,
        toFecharPedidoPayload(values),
      );
      if (result.success) {
        onPedidoUpdated(result.data);
        setFechouOk(true);
      } else {
        setFecharError(result.error || "Erro ao fechar pedido");
      }
    } finally {
      setIsFechando(false);
    }
  };

  return {
    fechamentoForm: form,
    formas,
    condicoes,
    isLoadingFormas,
    loadFormasCondicoes,
    canFechar,
    isFechando,
    fecharError,
    onFechar,
    fechouOk,
    setFechouOk,
  };
}
