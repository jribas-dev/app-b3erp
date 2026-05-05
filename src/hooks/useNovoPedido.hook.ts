"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useSelectedEmitente } from "@/components/selected-emitente-provider";

import { useClienteSearch } from "./novoPedido/useClienteSearch.hook";
import { useEmitenteOperacao } from "./novoPedido/useEmitenteOperacao.hook";
import { useNovoPedidoSubmit } from "./novoPedido/useNovoPedidoSubmit.hook";

// Orquestrador da criação de pedido. Compõe sub-hooks (emitente/operação,
// busca de cliente, submit) e adiciona o pequeno estado local de
// rcfat + os refs de focus management inicial.
export function useNovoPedido() {
  const { selectedIdemp, setSelectedIdemp } = useSelectedEmitente();

  const cliente = useClienteSearch();

  const emitOper = useEmitenteOperacao({
    selectedIdemp,
    setSelectedIdemp,
    onEmitenteChanged: cliente.clearCliente,
  });

  const [rcfat, setRcfat] = useState<"F" | "E">("E");

  const submit = useNovoPedidoSubmit({
    selectedIdemp,
    selectedIdOper: emitOper.selectedIdOper,
    selectedCliente: cliente.selectedCliente,
    rcfat,
  });

  // Focus management inicial — depois que tudo carrega, foca no primeiro
  // campo a preencher.
  const emitenteTriggerRef = useRef<HTMLButtonElement>(null);
  const operacaoTriggerRef = useRef<HTMLButtonElement>(null);
  const clienteInputRef = useRef<HTMLInputElement>(null);
  const initialFocusDoneRef = useRef(false);

  useEffect(() => {
    if (initialFocusDoneRef.current) return;
    if (emitOper.isLoadingEmitentes) return;

    if (!selectedIdemp) {
      emitenteTriggerRef.current?.focus();
      initialFocusDoneRef.current = true;
      return;
    }

    if (emitOper.isLoadingOperacoes) return;

    if (emitOper.selectedIdOper) {
      clienteInputRef.current?.focus();
    } else {
      operacaoTriggerRef.current?.focus();
    }
    initialFocusDoneRef.current = true;
  }, [
    emitOper.isLoadingEmitentes,
    selectedIdemp,
    emitOper.isLoadingOperacoes,
    emitOper.selectedIdOper,
  ]);

  // Wrap onIdemandChange para também limpar resultados de cliente (já cobre
  // selectedCliente via callback no sub-hook, mas o orquestrador mantém a
  // assinatura pública estável).
  const onIdemandChange = useCallback(
    async (idemp: number) => {
      await emitOper.onIdemandChange(idemp);
    },
    [emitOper],
  );

  return {
    emitentes: emitOper.emitentes,
    isLoadingEmitentes: emitOper.isLoadingEmitentes,
    selectedIdemp,
    onIdemandChange,
    operacoes: emitOper.operacoes,
    isLoadingOperacoes: emitOper.isLoadingOperacoes,
    selectedIdOper: emitOper.selectedIdOper,
    setSelectedIdOper: emitOper.setSelectedIdOper,

    clienteQuery: cliente.clienteQuery,
    onClienteQueryChange: cliente.onClienteQueryChange,
    clienteResults: cliente.clienteResults,
    isSearching: cliente.isSearching,
    showResults: cliente.showResults,
    setShowResults: cliente.setShowResults,
    selectedCliente: cliente.selectedCliente,
    isLoadingCliente: cliente.isLoadingCliente,
    onClienteSelect: cliente.onClienteSelect,

    rcfat,
    setRcfat,

    isSubmitting: submit.isSubmitting,
    submitError: submit.submitError,
    onSubmit: submit.onSubmit,
    canSubmit: submit.canSubmit,

    emitenteTriggerRef,
    operacaoTriggerRef,
    clienteInputRef,
  };
}
