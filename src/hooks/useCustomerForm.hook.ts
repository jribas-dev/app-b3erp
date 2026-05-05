"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";

import { useSelectedEmitente } from "@/components/selected-emitente-provider";
import {
  ClienteFormSchema,
  EMPTY_CLIENTE_FORM,
  type ClienteFormValues,
} from "@/lib/forms/cliente-form.form";
import { maskDocfed } from "@/lib/format/document";
import { isValidCNPJ } from "@/lib/validation/cnpj";
import { isValidCPF } from "@/lib/validation/cpf";

import type { CustomerMode } from "./customerForm/customer-mode";
import { useCepLookup } from "./customerForm/useCepLookup.hook";
import { useCustomerData } from "./customerForm/useCustomerData.hook";
import { useCustomerInit } from "./customerForm/useCustomerInit.hook";
import { useCustomerSubmit } from "./customerForm/useCustomerSubmit.hook";

export type { CustomerMode } from "./customerForm/customer-mode";

// Orquestrador do cadastro de cliente. Compõe sub-hooks: contexto inicial,
// search/seleção, lookup de CEP, e submit. Mantém interface pública estável.
export function useCustomerForm() {
  const { selectedIdemp, setSelectedIdemp } = useSelectedEmitente();
  const [mode, setMode] = useState<CustomerMode>("idle");
  const [clienteId, setClienteId] = useState<number | null>(null);

  const form = useForm<ClienteFormValues>({
    resolver: zodResolver(ClienteFormSchema),
    defaultValues: EMPTY_CLIENTE_FORM,
    mode: "onChange",
  });

  const {
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { isValid, isSubmitting },
  } = form;

  const init = useCustomerInit({
    setValue,
    selectedIdemp,
    setSelectedIdemp,
  });

  const submit = useCustomerSubmit({
    handleSubmit,
    mode,
    clienteId,
    setMode,
    setClienteId,
  });

  const dataSearch = useCustomerData({
    reset,
    selfVendId: init.selfVendId,
    setMode,
    setClienteId,
    setSubmitError: submit.setSubmitError,
    setSubmitSuccess: submit.setSubmitSuccess,
  });

  const cep = useCepLookup({ setValue, getValues });

  // Pequeno: docfed mascarado + auto-detect tipopessoa. Mantido aqui por
  // brevidade (~12 linhas) — extrair em sub-hook seria over-engineering.
  const onDocfedChange = useCallback(
    (v: string) => {
      setValue("docfedDisplay", maskDocfed(v), { shouldValidate: true });
      const raw = v.replace(/\D/g, "");
      if (raw.length === 11 && isValidCPF(raw)) {
        setValue("tipopessoa", "F");
      } else if (raw.length === 14 && isValidCNPJ(raw)) {
        if (getValues("tipopessoa") === "F") {
          setValue("tipopessoa", "J");
        }
      }
    },
    [setValue, getValues],
  );

  const canSave =
    mode !== "idle" && isValid && !isSubmitting && !dataSearch.isLoadingCliente;

  return {
    mode,
    isLoadingInit: init.isLoadingInit,
    isSupervisor: init.isSupervisor,
    selfVendId: init.selfVendId,
    equipe: init.equipe,
    emitentes: init.emitentes,
    selectedIdemp,
    operacoes: init.operacoes,
    form,
    onDocfedChange,
    onCepChange: cep.onCepChange,
    onCepBlur: cep.onCepBlur,
    isCepLoading: cep.isCepLoading,
    isLoadingCliente: dataSearch.isLoadingCliente,
    isSubmitting,
    submitError: submit.submitError,
    submitSuccess: submit.submitSuccess,
    canSave,
    searchOpen: dataSearch.searchOpen,
    searchQuery: dataSearch.searchQuery,
    searchResults: dataSearch.searchResults,
    isSearching: dataSearch.isSearching,
    openSearch: dataSearch.openSearch,
    closeSearch: dataSearch.closeSearch,
    onSearchQueryChange: dataSearch.onSearchQueryChange,
    onSelectFromSearch: dataSearch.onSelectFromSearch,
    onNewCliente: dataSearch.onNewCliente,
    onSubmit: submit.onSubmit,
    onIdemandChange: init.onIdemandChange,
  };
}
