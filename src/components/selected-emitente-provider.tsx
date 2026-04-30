"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { setSelectedEmitenteAction } from "@/lib/vendas/cfg.service";

type SelectedEmitenteContextValue = {
  selectedIdemp: number | null;
  setSelectedIdemp: (idemp: number) => Promise<void>;
};

const SelectedEmitenteContext =
  createContext<SelectedEmitenteContextValue | null>(null);

export function SelectedEmitenteProvider({
  initialIdemp,
  children,
}: {
  initialIdemp: number | null;
  children: ReactNode;
}) {
  const [selectedIdemp, setSelectedIdempState] = useState<number | null>(
    initialIdemp,
  );

  const setSelectedIdemp = useCallback(async (idemp: number) => {
    const result = await setSelectedEmitenteAction(idemp);
    if (result.success) {
      setSelectedIdempState(idemp);
    }
  }, []);

  return (
    <SelectedEmitenteContext.Provider value={{ selectedIdemp, setSelectedIdemp }}>
      {children}
    </SelectedEmitenteContext.Provider>
  );
}

export function useSelectedEmitente(): SelectedEmitenteContextValue {
  const ctx = useContext(SelectedEmitenteContext);
  if (!ctx) {
    throw new Error(
      "useSelectedEmitente deve ser usado dentro de SelectedEmitenteProvider",
    );
  }
  return ctx;
}
