import * as React from "react";

import {
  Callout,
  CalloutActions,
  CalloutDescription,
  CalloutTitle,
} from "@/components/ui/callout";
import { Button } from "@/components/ui/button";
import { LoadingFallbackLarge } from "@/components/home/loading-fallback";

// AsyncBoundary substitui o trio repetido em ≥6 páginas:
//   if (isLoading) return <LoadingFallbackLarge />;
//   if (error || !data) return <Callout variant="destructive">…</Callout>;
//   return <Children />
//
// Uso:
//   <AsyncBoundary status={isLoading ? "loading" : error ? "error" : "ready"}
//                  error={error} onRetry={refetch}>
//     {children que dependem do data}
//   </AsyncBoundary>

export type AsyncStatus = "loading" | "error" | "ready";

interface AsyncBoundaryProps {
  status: AsyncStatus;
  error?: string | null;
  onRetry?: () => void;
  loadingFallback?: React.ReactNode;
  emptyFallback?: React.ReactNode;
  errorTitle?: string;
  children: React.ReactNode;
}

export const AsyncBoundary: React.FC<AsyncBoundaryProps> = ({
  status,
  error,
  onRetry,
  loadingFallback,
  errorTitle = "Não foi possível carregar",
  children,
}) => {
  if (status === "loading") {
    return <>{loadingFallback ?? <LoadingFallbackLarge />}</>;
  }

  if (status === "error") {
    return (
      <Callout variant="destructive">
        <CalloutTitle>{errorTitle}</CalloutTitle>
        {error ? <CalloutDescription>{error}</CalloutDescription> : null}
        {onRetry ? (
          <CalloutActions>
            <Button size="sm" onClick={onRetry}>
              Tentar novamente
            </Button>
          </CalloutActions>
        ) : null}
      </Callout>
    );
  }

  return <>{children}</>;
};
