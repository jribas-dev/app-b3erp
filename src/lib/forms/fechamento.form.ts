import { z } from "zod";
import type { FecharPedidoPayload } from "@/types/vendas.types";

export const FechamentoFormSchema = z.object({
  idForma: z.string(),
  idCond: z.string(),
  obsInter: z.string().max(255, "Observação deve ter no máximo 255 caracteres"),
});

export type FechamentoFormValues = z.infer<typeof FechamentoFormSchema>;

export const EMPTY_FECHAMENTO_FORM: FechamentoFormValues = {
  idForma: "",
  idCond: "",
  obsInter: "",
};

export function toFecharPedidoPayload(
  v: FechamentoFormValues,
): FecharPedidoPayload {
  const obs = v.obsInter.trim();
  return {
    ...(v.idForma && { idForma: parseInt(v.idForma, 10) }),
    ...(v.idCond && { idCond: parseInt(v.idCond, 10) }),
    ...(obs && { obsInter: obs }),
  };
}
