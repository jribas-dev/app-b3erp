# Refactor SOLID / Clean Code — Histórico

> Registro histórico do plano de refatoração que originou os requisitos de qualidade
> formalizados em [CLAUDE.md](../CLAUDE.md#code-quality-requirements-solid--clean-code).
> Concluído em 2026-05-05 (commits `4b152d4`, `30fcabe`, `b37215f`, `ab97ccf`, fase 7 final).

## Motivação

O projeto chegou em maio/2026 com violações concretas de SOLID e Clean Code que dificultavam
manutenção e onboarding:

- **God hooks** acumulando estado, side effects e validação num único arquivo
  (`useEditarPedido` ~430 linhas, `useNovoPedido` ~280, `useCustomerForm` ~300+).
- **Páginas monolíticas** misturando layout, estado, formulários e lógica de domínio
  (`saler/orders/edit/page.tsx`, `home/user-edit/page.tsx`, etc.).
- **DIP violado nos hooks** — cada hook importava 5–8 server actions soltas de
  `src/lib/<dominio>/*.service.ts`.
- **DRY violado** em loading/error states, validadores (CPF, CNPJ, telefone, CEP),
  page containers, listagens responsivas.
- **Tipos paralelos** ao Zod schema (drift garantido em payloads de pedidos).
- **Erros silenciosos** com `catch { return null }` e `console.error` direto.
- **`src/lib/vendas/*.service.ts`** monolíticos misturando queries (read) e mutations (write)
  no mesmo arquivo, dificultando entender o intent ao bater o olho.

## Fases executadas

### Fase 0 — Middleware/Sessão (commit `2703512`)

Pré-requisito da refatoração: eliminar round-trip a `/backend/session` e centralizar
verificação de JWT em `src/lib/auth/edge-safe.ts` (HS256 via `jose`). Middleware vira
pipeline tipado de `Handler[]`. Rotas/menu centralizadas em `src/config/route-registry.ts`.

### Fase 1–3 — Foundations + tipos + API layer (commit `4b152d4`)

- **Foundations**: sonner toast, `ErrorBoundary`, primitivos `Callout`, `FormSection`,
  `LoadingState`, `ResponsiveList`, `PageContainer`.
- **Tipos**: Zod como source-of-truth via `z.infer<typeof Schema>`. Renomeação
  `src/lib/validations/` → `src/lib/forms/` (todo schema de form vive aqui).
- **Validadores**: extraídos para `src/lib/validation/{cpf,cnpj,telefone,cep}.ts`.
- **API layer (DIP)**: facades agrupadas em `src/lib/api/`:
  - `customersApi`, `pedidosApi`, `produtosApi`, `equipeApi`, `pagamentosApi`,
    `metricasApi`, `tabelaPrecosApi`, `cfgApi`.
  - Hooks consomem `xxxApi.method()`, não importam server actions soltas.

### Fase 4 — God hooks (commit `30fcabe`)

Decomposição de hooks-deus em sub-hooks focados orquestrados por hook fino:

- `useEditarPedido` → `edicaoPedido/{useProdutoSearch, usePedidoState, useFechamento, ...}`
- `useNovoPedido` → `novoPedido/{useClienteSearch, useOperacaoSelect, ...}`
- `useCustomerForm` → `customerForm/{useCustomerData, useCustomerInit, useCustomerSubmit}`

Cada sub-hook ≤150 linhas; hook orquestrador apenas compõe.

### Fase 5 — Páginas monolíticas (commit `b37215f`)

Decomposição de páginas em componentes focados por domínio:

- `saler/orders/edit/page.tsx` → `components/orders/edit/{adicionar-produto,
  fechamento-form, pedido-resumo, itens-list}.tsx`
- `home/user-edit/page.tsx` → componentes de seção
- `saler/customers/page.tsx` → `components/customers/{identificacao,comercial,
  endereco,contato}-section.tsx` + `search-dialog.tsx`
- `saler/orders/new/page.tsx` → `components/orders/new/{cliente-card, cliente-search,
  operacao-selector, tipo-pedido-toggle}.tsx`

### Fase 6 — Reorganização `src/lib/vendas/` (commit `ab97ccf`)

Separação por intent (read vs write) em folder-per-domain:

```
src/lib/vendas/
├── cfg/         (queries.ts + mutations.ts + index.ts)
├── clientes/    (queries.ts + mutations.ts + external.ts + index.ts)
├── equipe/      (queries.ts + mutations.ts + index.ts)
├── metricas/    (queries.ts + index.ts)
├── pagamentos/  (queries.ts + index.ts)
├── pedidos/     (queries.ts + mutations.ts + index.ts)  // pedido-itens fundido
├── produtos/    (queries.ts + index.ts)                 // calcImposto fica em queries (read-only)
├── tabela-precos/ (queries.ts + index.ts)
├── schemas.ts
└── index.ts     // barrel raiz
```

9 arquivos `*.service.ts` deletados; cada domínio expõe barrel próprio. `src/lib/api/*`
continua importando do barrel raiz, sem alteração na superfície externa.

### Fase 7 — Auditoria final + cleanup

Auditoria automatizada confirmou:

- ✅ **Zero `any`** em `src/**/*.{ts,tsx}` (`grep "\\bany\\b"` → 0 matches).
- ✅ **Zero `console.*`** fora de `src/lib/observability/log.ts` (migrados os dois
  remanescentes — `useAuth.hook.ts:70` e `user-pre/confirm/page.tsx:103` — para `logError`).
- ⚠️ **Tamanhos de arquivo**: a maioria respeita os limites; alguns ainda acima como
  débito conhecido (ver "Pendências" abaixo).

## Requisitos formalizados

A refatoração estabilizou as regras documentadas na seção
[Code quality requirements (SOLID + Clean Code)](../CLAUDE.md#code-quality-requirements-solid--clean-code)
de `CLAUDE.md`. Toda nova contribuição deve aderir; PRs que violem precisam de justificativa.

Resumo dos pontos formalizados:

- SRP por arquivo + limites de tamanho como pontos de alerta (page ≤250, hook ≤150,
  component ≤200).
- DRY: padrões repetidos viram primitivos; validadores em `src/lib/validation/`.
- Zod como source-of-truth (`z.infer`); `ActionResult<T>` como shape canônica.
- Sem `any`, sem `console.*` direto, sem `catch { return null }`.
- DIP em hooks via API facades agrupadas; OCP em rotas via `route-registry.ts`.
- Camadas claras: `components/ui/` (shadcn), `components/<dominio>/`, `hooks/`,
  `lib/<dominio>/`, `config/`, `types/`.

## Pendências conhecidas (débito reconhecido)

A auditoria de tamanho identificou arquivos ainda acima dos limites, mantidos como
débito de baixa prioridade — não impedem evolução, mas são candidatos quando a próxima
mudança grande tocar a área:

**Pages > 250 linhas (excluindo legais estáticas):**
- `admin/grid/page.tsx` (551), `admin/graph/page.tsx` (546)
- `saler/performance/page.tsx` (487), `saler/orders/find/page.tsx` (387)
- `home/user-edit/page.tsx` (363), `auth/reset-password/page.tsx` (324)
- `saler/orders/view/page.tsx` (318), `saler/price-table/page.tsx` (311)
- `user-pre/confirm/page.tsx` (272)

**Hooks > 150 linhas:**
- `usePerformance.hook.ts` (244), `useLostPassword.hook.ts` (161)
- `edicaoPedido/useProdutoSearch.hook.ts` (161), `useEditarPedido.hook.ts` (156)
- `useInstanceSelector.hook.ts` (153)

**Components > 200 linhas:**
- `orders/edit/adicionar-produto.tsx` (288)

Pages legais (`terms-of-service`, `privacy-policy`) foram dispensadas por serem texto
estático sem composição lógica.

## Lições

- **Iterar em fases pequenas** com commit por fase permitiu rollback granular se um teste
  manual quebrasse — nenhum quebrou, mas o método se mostrou correto.
- **Zod-first** elimina drift de tipos sem custo: `z.infer` paga sozinho.
- **Folder-per-domain com queries/mutations** torna o intent visível antes de abrir o
  arquivo. Recomendado para qualquer novo domínio em `src/lib/`.
- **Sub-hooks com orquestrador** é o padrão certo para forms grandes; tentar resolver
  com `useReducer` puro perde legibilidade.
