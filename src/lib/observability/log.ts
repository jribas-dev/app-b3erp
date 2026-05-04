/**
 * Log estruturado server-side. Saída JSON em uma única linha — fácil de
 * ingerir em Sentry/Datadog/CloudWatch/Vercel Logs.
 *
 * Single point of change: para integrar a uma observability stack, plugue um
 * sink em `emit` (ex.: forward para Sentry.captureException quando level ===
 * "error"). Tudo que passa por createAction e demais services usa estas
 * funções, então a mudança é centralizada.
 */

type LogLevel = "info" | "warn" | "error";

function emit(
  level: LogLevel,
  scope: string,
  payload: { message: string; stack?: string; context?: Record<string, unknown> },
): void {
  const entry = {
    ts: new Date().toISOString(),
    level,
    scope,
    message: payload.message,
    ...(payload.stack ? { stack: payload.stack } : {}),
    ...(payload.context ? { context: payload.context } : {}),
  };
  const line = JSON.stringify(entry);
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export function logError(
  scope: string,
  error: unknown,
  context?: Record<string, unknown>,
): void {
  const message = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;
  emit("error", scope, { message, stack, context });
}

export function logWarn(
  scope: string,
  message: string,
  context?: Record<string, unknown>,
): void {
  emit("warn", scope, { message, context });
}

export function logInfo(
  scope: string,
  message: string,
  context?: Record<string, unknown>,
): void {
  emit("info", scope, { message, context });
}
