# B3 ERP — Design Rules for AI Agents
**Referência rápida para geração de código, componentes e interfaces.**

---

## 1. Identidade Visual — Regras Obrigatórias

### Cores
- **Sempre usar tokens CSS** definidos em `src/app/globals.css`. Nunca usar valores hexadecimais avulsos.
- Cor primária: `var(--primary)` = `oklch(0.5547 0.2503 297.0)` (púrpura)
- Cor de destaque: `var(--accent)` = `oklch(0.682 0.1448 235.4)` (azul)
- Fundo: `var(--background)`, cards: `var(--card)`, texto: `var(--foreground)`
- Estado de erro: `var(--destructive)`, sucesso: `oklch(0.625 0.177 140.4)`
- **Nunca inventar novas cores.** Se precisar de variação, usar opacidade sobre os tokens existentes.
- Suporte obrigatório a **dark mode**: todos os componentes devem funcionar com a classe `.dark`.

### Logotipo
- Sempre renderizar como `<span>B3</span><span>ERP</span>` — peso 900 e 300 respectivamente.
- Cor: `var(--primary)` para "B3", `var(--foreground)` para "ERP" no light mode.
- No dark mode: `var(--primary)` light para "B3", texto com opacidade reduzida para "ERP".
- **Nunca** distorcer proporções, aplicar gradientes ou sombras ao logo.

---

## 2. Tipografia

| Papel | Família | Token CSS |
|-------|---------|-----------|
| Corpo / Interface | Roboto | `var(--font-sans)` |
| Display / Headlines | Playfair Display | `var(--font-serif)` |
| Dados técnicos / Mono | JetBrains Mono | `var(--font-mono)` |

- Tamanho mínimo de texto em interface: **14px**
- Tamanho mínimo em mobile: **14px** (nunca abaixo)
- Touch targets mobile: **nunca abaixo de 44px**
- Line-height padrão: `1.6` para corpo, `1.1–1.2` para headlines
- Usar `text-wrap: pretty` em parágrafos e títulos longos
- Usar Playfair Display **somente** em títulos de alto impacto (hero, marketing)
- Usar JetBrains Mono **somente** para CPF, CNPJ, datas, valores monetários, código

---

## 3. Espaçamento & Layout

- Todo espaçamento em **múltiplos de 4px** (escala Tailwind padrão)
- Border-radius padrão: `var(--radius)` = `0.35rem`
  - Botões e inputs: `var(--radius)`
  - Cards de módulo: `calc(var(--radius) * 3)` ≈ 1rem
  - Badges/chips: `border-radius: 100px` (pill)
- Sombras: usar os tokens `--shadow-xs`, `--shadow-sm`, `--shadow-lg`, `--shadow-2xl`
- Layout de page: `max-width: 1200px; margin: 0 auto; padding: 0 3rem`
- Header fixo: `height: 56px`

---

## 4. Componentes — Padrões

### Botões
```tsx
// Primary — ação principal
className="bg-primary text-primary-foreground px-4 py-2 rounded-(--radius) font-medium text-sm transition-colors hover:bg-primary/90"

// Outline — ação secundária
className="border border-primary text-primary px-4 py-2 rounded-(--radius) font-medium text-sm"

// Destructive — ação destrutiva
className="bg-destructive text-destructive-foreground px-4 py-2 rounded-(--radius) font-medium text-sm"
```

### Cards de Módulo (Dashboard)
```tsx
// Estrutura padrão de card de módulo
<div className="bg-card border border-border rounded-[calc(var(--radius)*3)] p-5 shadow-sm flex flex-col items-center gap-2 text-center">
  <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary">
    <Icon size={20} />
  </div>
  <span className="text-sm font-medium text-foreground">{name}</span>
</div>
```

### Inputs / Formulários
```tsx
// Label sempre acima do campo
<div className="flex flex-col gap-1.5">
  <label className="text-sm font-medium text-foreground">{label}</label>
  <input className="bg-input border border-border rounded-(--radius) px-3 py-2 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-colors" />
</div>
```

### Badges
```tsx
// Usar variantes semânticas — nunca cores avulsas
<Badge variant="default">Supersaler</Badge>   // primário
<Badge variant="secondary">Saler</Badge>      // secundário
<Badge variant="destructive">Cancelado</Badge> // erro
```

### Ícones
- Usar **exclusivamente Lucide React** (`lucide-react`)
- Tamanho padrão: `size={20}` em interfaces, `size={16}` em texto inline
- Em icon buttons: mínimo `size={20}` com área clicável de 44×44px no mobile

---

## 5. Perfis de Usuário & Permissões

| Role | Rota base | Módulos |
|------|-----------|---------|
| `admin` | `/admin/` | Dashboards e relatórios administrativos |
| `supersaler` | `/saler/` | Todos os módulos de vendas + cadastro de clientes + equipe |
| `saler` | `/saler/` | Pedidos, histórico, preços, desempenho |
| `buyer` | `/buyer/` | Dados, pedido de compra, histórico |
| `inventory` | `/inventory/` *(futuro)* | Operações de estoque |

- Verificar roles sempre via `src/mocks/routes-permission.ts`
- Nunca renderizar módulos fora da permissão do role atual
- Role obtido via `useSession` hook

---

## 6. Linguagem & Copywriting

- **Português do Brasil** em toda a interface. Sem anglicismos.
- CTAs: verbos no **imperativo** — "Salvar", "Lançar Pedido", "Fazer Login"
- Erros: explicar a **ação corretiva**, não o código de erro — "Verifique o email" não "Erro 401"
- Nomes de módulos: usar exatamente como definido em `src/mocks/dash-items-private.ts`
- Evitar: "Settings" → usar "Configurações"; "Performance" → "Desempenho"; "Team" → "Equipe"

---

## 7. Motion & Interação

- Transições padrão: `transition-colors duration-200` (botões, links, inputs)
- Entradas de conteúdo: `opacity` + `translateY` sutil, máximo **300ms**
- Loading states: usar `animate-pulse` do Tailwind ou spinner com `var(--primary)`
- Sempre implementar `prefers-reduced-motion`:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 8. Acessibilidade

- Contraste mínimo WCAG AA: **4.5:1** para texto normal, **3:1** para texto grande
- Todos os inputs com `<label>` associado
- Botões de ícone com `aria-label` descritivo
- Foco visível: `focus:ring-2 focus:ring-primary/50`
- Touch targets mobile: mínimo **44×44px**

---

## 9. Estrutura de Arquivos

```
src/
├── app/
│   ├── globals.css          ← tokens de design (NÃO modificar sem aprovação)
│   ├── (dash)/              ← rotas autenticadas
│   └── (site)/              ← rotas públicas
├── components/
│   ├── ui/                  ← shadcn/ui components (não modificar diretamente)
│   ├── header/
│   ├── footer/
│   └── home/
├── fonts/fonts-app.tsx      ← configuração de fontes Next.js
├── hooks/                   ← useAuth, useSession, useUserEdit, etc.
├── mocks/                   ← dados de permissões e menus
├── lib/                     ← serviços (auth, user-edit, etc.)
└── types/                   ← interfaces TypeScript
```

---

## 10. Checklist antes de gerar código

- [ ] Cores usando `var(--token)`, não hex avulso
- [ ] Dark mode testado (classe `.dark`)
- [ ] Tipografia nas famílias aprovadas e pesos corretos
- [ ] Border-radius usando `var(--radius)` e múltiplos
- [ ] Espaçamento em múltiplos de 4px
- [ ] Touch targets ≥ 44px em mobile
- [ ] Ícones Lucide React exclusivamente
- [ ] Texto em Português BR, CTA no imperativo
- [ ] Role do usuário verificado antes de renderizar módulos
- [ ] `prefers-reduced-motion` considerado

---

## 11. Mobile First & Espaçamento Padrão

> **Esta aplicação é mobile first.** O alvo primário é o celular em modo retrato (portrait), largura mínima de 360px. Use breakpoints `sm:` apenas como progressive enhancement — nunca como estilo base.

### Container padrão de página (dash)

```tsx
// CORRETO — nunca use p-6 ou max-w-3xl em páginas dash
<div className="container mx-auto max-w-xl px-3 py-4 space-y-4">
```

- `px-3` (12px) horizontal + `py-4` (16px) vertical — aproveitamento máximo em tela estreita
- `max-w-xl` (576px) — adequado para mobile e tablet; não usar `max-w-2xl` ou `max-w-3xl`
- `space-y-4` entre cards/blocos — não usar `space-y-5` ou `space-y-6`

### Listas de itens (pedidos, clientes, produtos)

Layout obrigatório de **3 linhas** por item — garante que nenhuma informação seja cortada:

```tsx
<li className="px-3 py-2.5 hover:bg-muted/30 transition-colors">
  {/* Linha 1: identificador (esq) + metadado como data (dir) */}
  <div className="flex items-baseline justify-between gap-1 mb-0.5">
    <span className="font-mono text-sm font-semibold text-foreground">#id</span>
    <span className="font-mono text-xs text-muted-foreground">data</span>
  </div>
  {/* Linha 2: nome completo — NUNCA truncar razão social / nome de cliente */}
  <p className="text-sm font-medium text-foreground leading-snug mb-1.5">
    {nome}
  </p>
  {/* Linha 3: valor (esq) + botão de ação (dir) */}
  <div className="flex items-center justify-between gap-2">
    <span className="font-mono text-sm font-semibold">{valor}</span>
    <Button size="sm" variant="outline" className="gap-1 h-7 px-2.5 text-xs shrink-0">
      Ação
    </Button>
  </div>
</li>
```

- **Nunca usar `truncate`** em nomes de clientes, razão social ou produtos — reflowear o layout
- Botões em lista: `size="sm" className="h-7 px-2.5 text-xs shrink-0"`

### Formulários em CardContent

```tsx
<CardContent className="space-y-4">
  <div className="grid gap-1.5">
    <Label>Campo</Label>
    <Input ... />
  </div>
</CardContent>
```

- `space-y-4` dentro de `CardContent` — não usar `space-y-5`, `space-y-6` ou `gap-6`
- Labels sempre acima do campo, `gap-1.5` entre label e input

### Tabela de referência rápida

| Contexto | Classe |
|----------|--------|
| Container de página (dash) | `px-3 py-4` |
| Linha de lista | `px-3 py-2.5` |
| Padding interno de card | `p-3` ou `p-4` |
| Espaço entre seções/cards | `space-y-4` |
| Gap em formulário (entre campos) | `gap-4` (label→input: `gap-1.5`) |
| Botão em linha de lista | `h-7 px-2.5 text-xs shrink-0` |
| Largura máxima de página dash | `max-w-xl` |

---

*Gerado a partir do codebase `jribas-dev/app-b3erp` · Abril 2026*
*Ver documentação completa em `BRAND.md`*
