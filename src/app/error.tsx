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

export default function RootError({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    logError("error-boundary.root", error, { digest: error.digest });
  }, [error]);

  return (
    <main className="flex-1 flex items-center justify-center p-4">
      <Callout variant="destructive" className="max-w-md w-full">
        <CalloutTitle>Algo deu errado</CalloutTitle>
        <CalloutDescription>
          Ocorreu um erro inesperado. Tente novamente; se persistir, entre em
          contato com o suporte.
        </CalloutDescription>
        <CalloutActions>
          <Button size="sm" onClick={reset}>
            Tentar novamente
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href="/">Voltar ao início</Link>
          </Button>
        </CalloutActions>
      </Callout>
    </main>
  );
}
