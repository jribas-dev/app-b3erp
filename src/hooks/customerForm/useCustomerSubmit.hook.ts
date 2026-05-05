"use client";

import { useState } from "react";
import type { UseFormHandleSubmit } from "react-hook-form";

import { customersApi } from "@/lib/api";
import {
  toClienteFormPayload,
  type ClienteFormValues,
} from "@/lib/forms/cliente-form.form";

import type { CustomerMode } from "./customer-mode";

interface UseCustomerSubmitArgs {
  handleSubmit: UseFormHandleSubmit<ClienteFormValues>;
  mode: CustomerMode;
  clienteId: number | null;
  setMode: (mode: CustomerMode) => void;
  setClienteId: (id: number | null) => void;
}

export function useCustomerSubmit({
  handleSubmit,
  mode,
  clienteId,
  setMode,
  setClienteId,
}: UseCustomerSubmitArgs) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    setSubmitSuccess(false);

    const payload = toClienteFormPayload(values);

    let res;
    if (mode === "edit" && clienteId) {
      res = await customersApi.update(clienteId, payload);
    } else {
      res = await customersApi.create(payload);
      if (res.success) {
        setClienteId(res.data.id);
        setMode("edit");
      }
    }

    if (res.success) {
      setSubmitSuccess(true);
    } else {
      setSubmitError(res.error || "Erro ao salvar cliente");
    }
  });

  return {
    submitError,
    setSubmitError,
    submitSuccess,
    setSubmitSuccess,
    onSubmit,
  };
}
