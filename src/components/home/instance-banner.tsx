"use client";

import { DatabaseZap } from "lucide-react";

interface InstanceBannerProps {
  email: string;
  instanceName?: string;
  showSwitch: boolean;
  onSwitch: () => void;
}

// Topo da home autenticada: "Bem-vindo X" + chip da instância ativa com
// botão "Trocar" quando o usuário tem mais de uma.
export function InstanceBanner({
  email,
  instanceName,
  showSwitch,
  onSwitch,
}: InstanceBannerProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-1 py-3">
      <div className="shrink-0">
        <h1 className="text-lg font-medium text-foreground">
          Bem-vindo, <span className="font-bold">{email}</span>
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {instanceName && (
          <div className="flex items-center gap-3 bg-secondary/40 text-secondary-foreground px-3 py-2 rounded-(--radius) border border-border">
            <DatabaseZap
              aria-hidden="true"
              width={18}
              height={18}
              className="text-primary"
            />
            <p className="text-foreground text-xs font-semibold">
              {instanceName}
            </p>
            {showSwitch && (
              <button
                type="button"
                onClick={onSwitch}
                className="text-xs font-medium text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 rounded"
                aria-label="Trocar instância"
              >
                Trocar
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
