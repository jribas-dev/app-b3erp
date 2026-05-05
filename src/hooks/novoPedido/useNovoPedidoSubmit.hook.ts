"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import { pedidosApi } from "@/lib/api";
import type { ClienteDetalhe } from "@/lib/vendas/schemas";

interface UseNovoPedidoSubmitArgs {
  selectedIdemp: number | null;
  selectedIdOper: number | null;
  selectedCliente: ClienteDetalhe | null;
  rcfat: "F" | "E";
}

export function useNovoPedidoSubmit({
  selectedIdemp,
  selectedIdOper,
  selectedCliente,
  rcfat,
}: UseNovoPedidoSubmitArgs) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = useCallback(async () => {
    if (!selectedIdemp || !selectedIdOper || !selectedCliente) return;

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const result = await pedidosApi.create({
        rctipo: "O",
        rcfat,
        idCli: selectedCliente.id,
        idOper: selectedIdOper,
        idemp: selectedIdemp,
      });

      if (result.success) {
        router.push(`/saler/orders/edit?id=${result.data.id}`);
      } else {
        setSubmitError(result.error || "Erro ao criar pedido");
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedIdemp, selectedIdOper, selectedCliente, rcfat, router]);

  const canSubmit = !!(
    selectedIdemp &&
    selectedIdOper &&
    selectedCliente &&
    !isSubmitting
  );

  return { isSubmitting, submitError, onSubmit, canSubmit };
}
