"use server";

import { createAction } from "@/lib/api-action";
import type { ChartDataDto, Dominio, GridResponseDto, Periodo } from "@/types/dash.types";

export const getDashGraphAction = createAction<[Dominio, string, number, Periodo], ChartDataDto>({
  path: (dominio, metrica, idemp, periodo) =>
    `/b3dash/${dominio}/graph/${metrica}?idemp=${idemp}&periodo=${periodo}`,
  errorMsg: "Erro ao carregar dados do gráfico",
  scope: "getDashGraph",
});

export const getDashGridAction = createAction<
  [Dominio, string, number, Periodo, number, number, string | undefined],
  GridResponseDto<Record<string, unknown>>
>({
  path: (dominio, tipo, idemp, periodo, page, limit, status) => {
    const qs = new URLSearchParams({
      idemp: String(idemp),
      periodo,
      page: String(page),
      limit: String(limit),
    });
    if (status) {
      if (dominio === "estoque" && tipo === "por-produto" && status === "ruptura") {
        qs.set("apenasRuptura", "true");
      } else {
        qs.set("status", status);
      }
    }
    return `/b3dash/${dominio}/list/${tipo}?${qs}`;
  },
  errorMsg: "Erro ao carregar lista",
  scope: "getDashGrid",
});
