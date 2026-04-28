import type { ZodType } from "zod";
import { fetchWithAuth } from "./api-client";
import { logError } from "./observability/log";

export type ActionSuccess<T> = { success: true; data: T };
export type ActionFailure = {
  success: false;
  error: string;
  status?: number;
};
export type ActionResult<T> = ActionSuccess<T> | ActionFailure;

export type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

type StatusHandler<T> = (response: Response) => Promise<ActionResult<T>>;

export type EndpointSpec<TArgs extends unknown[], TOutput> = {
  /** Constrói o path absoluto do backend (sem o prefixo BACKEND_URL). */
  path: (...args: TArgs) => string;
  /** Verbo HTTP. Default: "GET". */
  method?: HttpMethod;
  /** Constrói o body. Quando ausente, nenhum body é enviado. */
  body?: (...args: TArgs) => unknown;
  /** Mensagem padrão quando o backend não retorna `message`. */
  errorMsg: string;
  /**
   * Mapeamento por status HTTP para casos especiais (204, 404, 403, 409, 201…).
   * Tem prioridade sobre o tratamento padrão de `response.ok`.
   */
  onStatus?: Record<number, StatusHandler<TOutput>>;
  /**
   * Quando false, pula o `response.json()` no caminho de sucesso e devolve
   * `data: undefined`. Use em endpoints que retornam apenas status (DELETE,
   * POST de associação, etc.). Default: true.
   */
  expectsBody?: boolean;
  /**
   * Schema zod opcional aplicado aos argumentos da action ANTES de fazer a
   * chamada ao backend. Use `z.tuple([...])` para validar a tupla TArgs.
   * Falha de validação retorna `{success: false, error}` sem network round-trip
   * — defesa contra inputs malformados (formData, querystring, etc.) e contra
   * chamadas de Server Action vindas de clientes adulterados.
   */
  inputSchema?: ZodType<TArgs>;
  /** Identificador para logging/telemetria. Default: o próprio path. */
  scope?: string;
};

async function defaultErrorMessage(
  response: Response,
  fallback: string,
): Promise<string> {
  const data = await response.json().catch(() => ({}));
  if (data && typeof data === "object" && "message" in data) {
    const msg = (data as { message?: unknown }).message;
    if (typeof msg === "string" && msg.length > 0) return msg;
  }
  return fallback;
}

export function createAction<TArgs extends unknown[], TOutput>(
  spec: EndpointSpec<TArgs, TOutput>,
): (...args: TArgs) => Promise<ActionResult<TOutput>> {
  const method = spec.method ?? "GET";
  return async (...args: TArgs): Promise<ActionResult<TOutput>> => {
    if (spec.inputSchema) {
      const parsed = spec.inputSchema.safeParse(args);
      if (!parsed.success) {
        const detail = parsed.error.issues
          .map((i) => `${i.path.join(".") || "input"}: ${i.message}`)
          .join("; ");
        return { success: false, error: `Dados inválidos — ${detail}` };
      }
    }

    const path = spec.path(...args);
    try {
      const init: RequestInit = { method, cache: "no-store" };
      if (spec.body !== undefined) {
        init.body = JSON.stringify(spec.body(...args));
      }

      const response = await fetchWithAuth(path, init);

      const handler = spec.onStatus?.[response.status];
      if (handler) return await handler(response);

      if (response.ok) {
        const skipParse =
          spec.expectsBody === false ||
          response.status === 204 ||
          response.status === 205;
        if (skipParse) {
          return { success: true, data: undefined as TOutput };
        }
        const data = (await response.json()) as TOutput;
        return { success: true, data };
      }

      const message = await defaultErrorMessage(response, spec.errorMsg);
      return { success: false, status: response.status, error: message };
    } catch (error) {
      logError(spec.scope ?? path, error, { method, path });
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Erro interno do servidor",
      };
    }
  };
}
