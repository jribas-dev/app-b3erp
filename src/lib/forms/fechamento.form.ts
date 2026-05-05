import { z } from "zod";
import type { FecharPedidoPayload } from "@/types/vendas.types";

export const FechamentoFormSchema = z.object({
  idForma: z.string().min(1, "Selecione a forma de pagamento"),
  idCond: z.string().min(1, "Selecione a condição de pagamento"),
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
    idForma: parseInt(v.idForma, 10),
    idCond: parseInt(v.idCond, 10),
    ...(obs && { obsInter: obs }),
  };
}
