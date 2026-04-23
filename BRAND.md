# B3 ERP — Brand Identity Guidelines
**Versão 1.0 · Abril 2026**

---

## Sumário

1. [Sobre a Marca](#1-sobre-a-marca)
2. [Storyboard da Marca](#2-storyboard-da-marca)
3. [Posicionamento & Valores](#3-posicionamento--valores)
4. [Logotipo](#4-logotipo)
5. [Sistema de Cores](#5-sistema-de-cores)
6. [Tipografia](#6-tipografia)
7. [Espaçamento & Grid](#7-espaçamento--grid)
8. [Componentes de UI](#8-componentes-de-ui)
9. [Motion & Interação](#9-motion--interação)
10. [Voz & Tom](#10-voz--tom)
11. [Personas & Perfis de Usuário](#11-personas--perfis-de-usuário)
12. [Stack Tecnológica](#12-stack-tecnológica)
13. [Checklist de Conformidade](#13-checklist-de-conformidade)

---

## 1. Sobre a Marca

**B3 ERP** é um Sistema de Gestão Integrado (ERP) desenvolvido pela B3 Sistemas, com mais de **17 anos de mercado** auxiliando empresas a se desenvolverem e se transformarem.

- **Produto:** WebApp de gestão empresarial
- **URL:** [b3erp.com.br](https://b3erp.com.br) · [app.b3erp.com.br](https://app.b3erp.com.br)
- **Público-alvo:** Empresas de comércio, indústria e serviços (PMEs brasileiras)
- **Plataformas:** Web (desktop e mobile), PWA

---

## 2. Storyboard da Marca

### Origem
Há mais de 17 anos, a B3 ERP nasceu para resolver um problema real das empresas brasileiras: sistemas de gestão complexos, caros e inacessíveis para pequenas e médias empresas. A missão sempre foi clara — **simplicidade sem abrir mão da potência**.

### O Problema que Resolve
Empresas enfrentam diariamente dezenas de processos manuais — pedidos, estoque, equipes, rotas, análises. O B3 ERP integra tudo em uma plataforma web, acessível de qualquer dispositivo, com foco em mobilidade e agilidade para equipes comerciais em campo.

### A Evolução
De sistema desktop para uma **WebApp moderna** em Next.js + TypeScript, o B3 ERP abraçou a transformação digital. O novo aplicativo reflete essa maturidade: design system coerente com Tailwind CSS v4 + shadcn/ui, modo escuro, PWA, e experiência mobile-first para vendedores em campo.

### Visão de Futuro
Ser a plataforma de gestão mais intuitiva para o mercado B2B brasileiro. Expandir para automação de rotas, análise preditiva de desempenho de equipes comerciais, e integração com ecossistemas como marketplace e nota fiscal eletrônica.

---

## 3. Posicionamento & Valores

### Taglines
- **Principal:** *"ERP preparado para os desafios atuais do seu negócio"*
- **Marketing:** *"Impulsione sua empresa"*
- **Produto:** *"Tornar as tarefas complexas o mais simples possível"*

### Pilares da Marca

| Pilar | Descrição |
|-------|-----------|
| **Simplicidade** | Menos cliques, menos telas, mais resultado. Cada funcionalidade acessível em até 3 toques no mobile. |
| **Integração** | Vendas, estoque, equipe e análise no mesmo lugar. Dados que conversam entre si sem exportações manuais. |
| **Confiança** | 17 anos de mercado. Empresa que cresce com o cliente. Comunicação transparente, suporte real. |

---

## 4. Logotipo

### Anatomia
O logotipo é composto por duas partes com pesos intencionalmente contrastantes:

- **"B3"** — peso 900 (ultra bold), cor primária púrpura
- **"ERP"** — peso 300 (light), cor foreground neutra

Esse contraste comunica: **força técnica + acessibilidade**.

### Variações Aprovadas

| Variação | Fundo | Uso |
|----------|-------|-----|
| Púrpura primário | Branco / Fundo claro | Uso primário (interface, documentos) |
| Púrpura light | Fundo escuro (dark mode) | Interface dark mode |
| Branco completo | Fundo púrpura sólido | Materiais de marketing, banners |

### Tamanhos Mínimos

- **Digital:** 80px de largura total
- **Mobile:** 72px de largura
- **Print:** 20mm de largura
- **Abaixo dos mínimos:** usar apenas o símbolo "B3"

### Regras de Uso

**✓ Use:**
- Logotipo em púrpura primária sobre fundos claros
- Variação light sobre fundos escuros
- Manter proporção original
- Espaçamento mínimo de 1× altura do logo ao redor (área de proteção)

**✗ Não use:**
- Distorção das proporções
- Gradientes sobre o logo
- Aplicação sobre fundos com baixo contraste
- Remoção do "ERP" do logotipo
- Sombras ou efeitos decorativos sobre o logo
- Cores não aprovadas

---

## 5. Sistema de Cores

Todas as cores usam o espaço **OKLCH** para garantir uniformidade perceptual e consistência entre temas light e dark.

### Cores Primárias

| Token | OKLCH | Uso |
|-------|-------|-----|
| `--primary` | `oklch(0.5547 0.2503 297.0)` | CTA, logo, ações principais |
| `--primary-light` | `oklch(0.7871 0.1187 304.8)` | Primary no dark mode |
| `--primary-dark` | `oklch(0.38 0.22 297.0)` | Hover / estado pressed |
| `--primary-ghost` | `oklch(0.93 0.04 297)` | Fundos de ícones, badges |

### Cor de Destaque (Accent)

| Token | OKLCH | Uso |
|-------|-------|-----|
| `--accent` | `oklch(0.682 0.1448 235.4)` | Links, destaques secundários |
| `--accent-dark` | `oklch(0.8467 0.0833 210.3)` | Accent no dark mode |

### Fundos & Neutros — Light Mode

| Token | OKLCH | Uso |
|-------|-------|-----|
| `--background` | `oklch(0.9578 0.0058 264.5)` | Fundo geral da aplicação |
| `--card` | `oklch(1 0 0)` | Cards, modais, formulários |
| `--muted` | `oklch(0.906 0.0117 264.5)` | Áreas secundárias |
| `--border` | `oklch(0.8083 0.0174 271.2)` | Divisores e bordas |
| `--foreground` | `oklch(0.4355 0.043 279.3)` | Texto principal |
| `--muted-foreground` | `oklch(0.5471 0.0343 279.1)` | Texto secundário |

### Fundos & Neutros — Dark Mode

| Token | OKLCH | Uso |
|-------|-------|-----|
| `--dark-bg` | `oklch(0.2155 0.0254 284.1)` | Fundo geral dark |
| `--dark-card` | `oklch(0.2429 0.0304 283.9)` | Cards dark |
| `--dark-border` | `oklch(0.324 0.032 282)` | Bordas dark |
| `--dark-fg` | `oklch(0.8787 0.0426 272.3)` | Texto dark |

### Cores de Estado

| Estado | OKLCH | Uso |
|--------|-------|-----|
| **Success** | `oklch(0.625 0.177 140.4)` | Confirmações, pedidos aprovados |
| **Danger** | `oklch(0.5505 0.2155 19.8)` | Erros, exclusões, alertas críticos |
| **Warning** | `oklch(0.692 0.204 42.4)` | Avisos, atenção |

### Cores para Gráficos

```
chart-1: oklch(0.5547 0.2503 297.0)  — Purple
chart-2: oklch(0.682  0.1448 235.4)  — Blue
chart-3: oklch(0.625  0.177  140.4)  — Green
chart-4: oklch(0.692  0.204  42.4)   — Orange
chart-5: oklch(0.714  0.105  33.1)   — Amber
```

### Princípios de Cor

1. **Chroma consistente:** cores de acento compartilham chroma similar para harmonia visual
2. **Acessibilidade:** contraste mínimo WCAG AA (4.5:1 para texto)
3. **Nunca inventar novas cores:** usar apenas os tokens do design system
4. **Saturação restrita em neutros:** brancos e cinzas com saturação máxima de 0.02

---

## 6. Tipografia

### Famílias

| Família | Tipo | Variável CSS | Uso principal |
|---------|------|--------------|---------------|
| **Roboto** | Sans-serif | `--font-sans` | Interface, formulários, corpo, botões |
| **Playfair Display** | Serif | `--font-serif` | Headlines de marketing, títulos editoriais |
| **JetBrains Mono** | Monospace | `--font-mono` | Dados técnicos, CNPJ, CPF, valores, tokens |

### Pesos disponíveis

**Roboto:** 300 (Light) · 400 (Regular) · 500 (Medium) · 700 (Bold) · 900 (Black)  
**Playfair Display:** 400 (Regular) · 700 (Bold) · Itálico disponível  
**JetBrains Mono:** 400 · 500

### Escala Tipográfica

| Nome | Tamanho | Uso |
|------|---------|-----|
| `xs` | 12px | Legendas, timestamps, textos auxiliares |
| `sm` | 14px | Labels de formulário, texto de suporte |
| `base` | 16px | Corpo de texto principal |
| `lg` | 18px | Subtítulos, descrições de seção |
| `xl` | 24px | Títulos de card e página |
| `2xl` | 32px | Headline principal de seção |
| `3xl+` | 48px+ | Hero, marketing, display |

### Regras Tipográficas

- Tamanho mínimo em interface: **14px** (mobile: nunca abaixo de 14px)
- Tamanho mínimo em print: **12pt**
- Line-height padrão: **1.6** para corpo, **1.1–1.2** para headlines
- Usar `text-wrap: pretty` para evitar viúvas e órfãos
- Playfair Display: usar com moderação — apenas em momentos de alto impacto
- JetBrains Mono: reservado para dados numéricos e técnicos

---

## 7. Espaçamento & Grid

### Escala de Espaçamento

Baseada em múltiplos de **4px** (Tailwind CSS padrão):

| Classe Tailwind | Valor | Uso comum |
|----------------|-------|-----------|
| `space-1` | 4px | Gaps internos mínimos |
| `space-2` | 8px | Padding de badges, gaps entre ícone e texto |
| `space-3` | 12px | Padding de inputs |
| `space-4` | 16px | Padding de cards pequenos |
| `space-6` | 24px | Padding de cards |
| `space-8` | 32px | Gap entre seções menores |
| `space-12` | 48px | Padding de seções |
| `space-16` | 64px | Gap entre seções maiores |
| `space-24` | 96px | Padding de hero / seções full |

### Border Radius

| Token | Valor | Uso |
|-------|-------|-----|
| `--radius` | 0.35rem (≈ 5.6px) | Padrão: botões, inputs |
| `--radius-sm` | 0.10rem | Elementos muito pequenos |
| `--radius-md` | 0.25rem | Elementos médios |
| `--radius-lg` | 0.35rem | Cards menores |
| `--radius-xl` | 0.60rem | Cards maiores, modais |
| `radius * 3` | ≈ 1rem | Cards de módulo (dashboard) |
| `100px` | pill | Badges, avatares, chips |

### Sombras

```css
shadow-xs:  0px 4px 6px 0px hsl(240 30% 25% / 0.06)
shadow-sm:  shadow-xs + 0px 1px 2px -1px (12%)
shadow-lg:  shadow-xs + 0px 4px 6px -1px (12%)
shadow-2xl: 0px 4px 6px 0px hsl(240 30% 25% / 0.30)
```

---

## 8. Componentes de UI

### Botões

| Variante | Uso |
|----------|-----|
| **Primary** (púrpura sólido) | Ação principal da tela — ex: "Salvar Alterações", "Fazer Login" |
| **Accent** (azul sólido) | Ação secundária de destaque |
| **Outline** | Ações secundárias, cancelar |
| **Ghost** | Ações terciárias, ícones, menus |
| **Danger** | Ações destrutivas — ex: "Excluir", "Cancelar Pedido" |

**Tamanhos:** `sm` (12px) · `default` (14px) · `lg` (16px)  
**Border-radius:** `var(--radius)` = 0.35rem  
**Transição:** 200ms  
**Peso:** 500 (Medium)

### Formulários

- Background: `var(--input)` = `oklch(0.8575 0.0145 268.5)`
- Border: `var(--border)` em repouso → `var(--primary)` em foco
- Focus ring: `0 0 0 3px oklch(0.5547 0.2503 297 / 0.15)`
- Erro: border `var(--danger)` com mensagem abaixo em `text-sm`
- Label: `text-sm font-medium` acima do campo

### Cards de Módulo (Dashboard)

- Background: `var(--card)` = branco
- Border: `1px solid var(--border)`
- Border-radius: `calc(var(--radius) * 3)` ≈ 1rem
- Shadow: `shadow-sm`
- Ícone: 44×44px, background `oklch(0.93 0.04 297)`, border-radius 50%
- Texto: `text-sm font-medium`, centralizado

### Badges

| Variante | Background | Texto |
|----------|------------|-------|
| Primary | `oklch(0.93 0.04 297)` | `var(--primary)` |
| Accent | `oklch(0.93 0.04 235)` | `var(--accent-dark)` |
| Success | `oklch(0.94 0.05 140)` | verde escuro |
| Warning | `oklch(0.96 0.06 42)` | laranja escuro |
| Danger | `oklch(0.95 0.05 19)` | `var(--danger)` |

Font-size: 11–12px · Font-weight: 600 · Border-radius: 100px (pill)

### Navegação

- Header fixo, altura 56px
- Logo à esquerda
- Ícones de ação à direita (perfil, tema)
- Background: `rgba(255,255,255,0.92)` com `backdrop-filter: blur(12px)`
- Border-bottom: `1px solid var(--border)`

---

## 9. Motion & Interação

### Princípio Geral

> Animações devem ser **funcionais, rápidas e discretas**. O B3 ERP é uma ferramenta de trabalho — nada deve distrair do fluxo produtivo.

### Tokens de Transição

| Token | Duração | Uso |
|-------|---------|-----|
| Fast | 100–150ms | Hover, focus rings, tooltips |
| Default | 200ms | Botões, links, inputs, switches |
| Slow | 300ms | Modais, drawers, navegação entre páginas |

### Padrões de Animação

| Padrão | Duração | Easing | Uso |
|--------|---------|--------|-----|
| Fade In + Slide Up | 200–300ms | ease-out | Cards entrando, modais |
| Pulse | 1.5s loop | ease-in-out | Loading, sincronização |
| Progress Bar | 2s | linear | Progresso de operações |
| Scale subtle | 150ms | ease-out | Hover em cards clicáveis |

### Regras

- Nunca exceder 300ms em interações comuns
- Preferir `opacity` + `transform` (GPU-accelerated)
- Nunca usar `animation` para decoração pura — apenas feedback funcional
- Respeitar `prefers-reduced-motion`

```css
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

---

## 10. Voz & Tom

### Atributos da Voz

| Atributo | Descrição |
|----------|-----------|
| **Direta** | Vá direto ao ponto. Sem rodeios. |
| **Ativa** | Verbos no imperativo para CTAs. A interface incentiva a ação. |
| **Humana** | Erros são oportunidades. Mensagens explicam o que fazer. |
| **Profissional** | Tom de parceiro de negócios confiável. Sem gírias. |
| **Empoderada** | O sistema capacita, não executa pelo usuário. |
| **Brasileira** | Português BR puro. Sem anglicismos desnecessários. |

### Exemplos de Cópia

| Contexto | ✓ Use | ✗ Evite |
|----------|-------|---------|
| CTA principal | "Salvar Alterações" | "Clique aqui para salvar" |
| Módulo | "Lançamento de Pedidos" | "Order Management" |
| Erro de login | "Verifique o email e tente novamente" | "Erro 401: credenciais inválidas" |
| CTA marketing | "Impulsione sua empresa" | "Manda ver nos seus negócios!" |
| Configuração | "Configurar Equipe" | "Team Settings" |
| Sucesso | "Pedido registrado com sucesso" | "Your order has been processed" |

### Hierarquia de Mensagens

1. **Confirmação** — o que o sistema fez ("Pedido #127 registrado")
2. **Instrução** — o que o usuário deve fazer ("Preencha o email")
3. **Erro** — o que aconteceu + como resolver ("Email inválido · Verifique o formato")
4. **Aviso** — atenção necessária ("Você tem 3 pedidos pendentes")

---

## 11. Personas & Perfis de Usuário

### Supervisor

**Perfil:** Gestor da equipe comercial. Acessa análises agregadas, configura estruturas e monitora resultados.

**Módulos disponíveis:**
- Lançamento de Pedidos (`/saler/orders`)
- Histórico de Pedidos (`/saler/orders-history`)
- Tabela de Preços (`/saler/price-table`)
- Analisar meu desempenho (`/saler/performance`)
- Lista de Clientes (`/super/customers`)
- Configurar Equipe (`/super/team`)
- Configurar Rota (`/super/team-route`)
- Analisar minha equipe (`/super/team-performance`)

**Prioridade de design:** Densidade de informação, dashboards analíticos.

---

### Saler (Vendedor em Campo)

**Perfil:** Vendedor mobile-first. Usa o app em campo, frequentemente com uma mão. Precisa de agilidade máxima.

**Módulos disponíveis:**
- Lançamento de Pedidos
- Histórico de Pedidos
- Tabela de Preços
- Analisar meu desempenho

**Prioridade de design:** Touch targets ≥ 44px, ações em ≤ 3 toques, lista vertical (mobile).

---

### Buyer (Comprador)

**Perfil:** Comprador de empresa cliente. Realiza pedidos de compra e acompanha transações.

**Módulos disponíveis:**
- Dados do Comprador (`/buyer/edit`)
- Pedido de Compra (`/buyer/orders`)
- Histórico de Pedidos (`/buyer/orders-history`)

**Prioridade de design:** Formulários claros, histórico acessível, confirmações explícitas.

---

## 12. Stack Tecnológica

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| Framework | Next.js (App Router) | 15.x |
| Linguagem | TypeScript | 5.x |
| Estilização | Tailwind CSS | 4.x |
| Animações CSS | tw-animate-css | — |
| Componentes base | shadcn/ui + Radix UI | — |
| Ícones | Lucide React | — |
| Fontes | Google Fonts (Roboto, Playfair Display, JetBrains Mono) | — |
| PWA | manifest.json | — |
| Autenticação | Custom hooks (useAuth, useSession) | — |

### Variáveis CSS de Fonte

```css
--font-sans:  'Roboto', sans-serif;
--font-serif: 'Playfair Display', serif;
--font-mono:  'JetBrains Mono', monospace;
```

### Import de Fontes (Next.js)

```tsx
import { Roboto, IBM_Plex_Serif } from "next/font/google";

export const robotoFont = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});
```

---

## 13. Checklist de Conformidade

Use esta lista ao criar novos componentes, telas ou materiais de marketing:

### Visual
- [ ] Cores do design system (sem hexadecimais avulsos)
- [ ] Tipografia nas famílias aprovadas e pesos corretos
- [ ] Border-radius usando tokens (`var(--radius)` e múltiplos)
- [ ] Sombras usando os tokens definidos
- [ ] Espaçamento em múltiplos de 4px
- [ ] Contraste de texto ≥ 4.5:1 (WCAG AA)
- [ ] Touch targets ≥ 44px em mobile

### Logo
- [ ] Proporções originais mantidas
- [ ] Área de proteção respeitada
- [ ] Variação correta para o fundo

### Conteúdo
- [ ] Português BR sem anglicismos
- [ ] CTAs em verbos no imperativo
- [ ] Mensagens de erro explicam a ação corretiva
- [ ] Sem jargões técnicos expostos ao usuário final

### Técnico
- [ ] Tokens CSS usados (não valores hard-coded)
- [ ] `prefers-reduced-motion` implementado
- [ ] Modo dark testado
- [ ] Responsivo testado em mobile (≥ 375px)

---

*B3 ERP Brand Guidelines v1.0 · Abril 2026 · Gerado a partir do codebase jribas-dev/app-b3erp*
