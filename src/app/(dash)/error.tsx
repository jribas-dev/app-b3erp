"use client";

import Link from "next/link";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Callout,
  CalloutActions,
  CalloutDescription,
  CalloutTitle,
} from "@/components/ui/callout";
import { logError } from "@/lib/observability/log";

type ErrorBoundaryProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function DashError({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    logError("error-boundary.dash", error, { digest: error.digest });
  }, [error]);

  return (
    <div className="flex items-center justify-center p-4">
      <Callout variant="destructive" className="max-w-md w-full">
        <CalloutTitle>Não foi possível carregar esta página</CalloutTitle>
        <CalloutDescription>
          Ocorreu um erro ao processar sua solicitação. Tente novamente; se
          persistir, volte ao início e tente outro caminho.
        </CalloutDescription>
        <CalloutActions>
          <Button size="sm" onClick={reset}>
            Tentar novamente
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href="/home">Voltar ao /home</Link>
          </Button>
        </CalloutActions>
      </Callout>
    </div>
  );
}
