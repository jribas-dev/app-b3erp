/**
 * Log estruturado para erros server-side. Saída JSON em uma única linha — fácil
 * de ingerir em Sentry/Datadog/CloudWatch/etc. quando integrarmos.
 *
 * Single point of change: para mandar pra observability stack, basta editar
 * aqui. Tudo que passa por createAction e demais services usa essa função.
 */
export function logError(
  scope: string,
  error: unknown,
  context?: Record<string, unknown>,
): void {
  const message = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;
  const entry = {
    ts: new Date().toISOString(),
    level: "error" as const,
    scope,
    message,
    ...(stack ? { stack } : {}),
    ...(context ? { context } : {}),
  };
  console.error(JSON.stringify(entry));
}
