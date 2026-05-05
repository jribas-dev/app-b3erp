"use client";

import { useCallback, useState } from "react";
import type {
  UseFormGetValues,
  UseFormSetValue,
} from "react-hook-form";

import { customersApi } from "@/lib/api";
import type { ClienteFormValues } from "@/lib/forms/cliente-form.form";
import { maskCep } from "@/lib/format/document";

interface UseCepLookupArgs {
  setValue: UseFormSetValue<ClienteFormValues>;
  getValues: UseFormGetValues<ClienteFormValues>;
}

// CEP mascarado + auto-preenche endereço/bairro/cidade/UF via ViaCEP no blur.
export function useCepLookup({ setValue, getValues }: UseCepLookupArgs) {
  const [isCepLoading, setIsCepLoading] = useState(false);

  const onCepChange = useCallback(
    (v: string) => {
      setValue("cepDisplay", maskCep(v), { shouldValidate: true });
    },
    [setValue],
  );

  const onCepBlur = useCallback(async () => {
    const cepDisplay = getValues("cepDisplay");
    const raw = cepDisplay.replace(/\D/g, "");
    if (raw.length !== 8) return;
    setIsCepLoading(true);
    try {
      const res = await customersApi.lookupCep(raw);
      if (res.success && res.data) {
        const d = res.data;
        if (d.logradouro) setValue("endereco", d.logradouro);
        if (d.bairro) setValue("bairro", d.bairro);
        if (d.localidade) setValue("cidade", d.localidade);
        if (d.uf) setValue("uf", d.uf);
      }
    } finally {
      setIsCepLoading(false);
    }
  }, [getValues, setValue]);

  return { isCepLoading, onCepChange, onCepBlur };
}
