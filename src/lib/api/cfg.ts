import {
  getEmitentesAction,
  getOperacoesAction,
  getSelectedEmitenteAction,
  getTenantCfgAction,
  setSelectedEmitenteAction,
} from "@/lib/vendas/cfg.service";

export const cfgApi = {
  getEmitentes: getEmitentesAction,
  getOperacoes: getOperacoesAction,
  getTenantCfg: getTenantCfgAction,
  getSelectedEmitente: getSelectedEmitenteAction,
  setSelectedEmitente: setSelectedEmitenteAction,
};
