import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Calendar,
  DollarSign,
  FileText,
  Grid2X2Check,
  PieChart,
  ShoppingCart,
  Sliders,
  UserCheck,
  UserStar,
  UserLock,
  ContactRound,
} from "lucide-react";

import type { DashItem, DashSection } from "@/types/dash-item";
import type { UserRole } from "@/types/role";

// Fonte única para rotas privadas, roles exigidas e metadata de menu.
//
// Duas categorias de entrada:
// - GATING PREFIXES (sem `menu`): controlam acesso por prefixo via middleware
//   (`pathname.startsWith(path)`). Ex.: `/admin` exige role `admin`.
// - MENU ENTRIES (com `menu`): páginas concretas listadas no dashboard.
//   Não entram em PROTECTED_ROUTES — gating de prefixo já cobre.
//
// Adicionar uma rota nova = adicionar uma entrada aqui. Middleware e
// dashboard derivam tudo automaticamente.

type GatingEntry = {
  path: string;
  roles: readonly UserRole[];
  menu?: never;
};

type MenuEntry = {
  path: string;
  roles: readonly UserRole[];
  menu: { label: string; icon: LucideIcon; section: DashSection };
};

export type RouteEntry = GatingEntry | MenuEntry;

export const ROUTES = [
  // Gating prefixes — acesso por área
  { path: "/admin", roles: ["admin"] },
  { path: "/buyer", roles: ["buyer"] },
  {
    path: "/home",
    roles: ["admin", "supersaler", "saler", "buyer", "inventory"],
  },
  { path: "/inventory", roles: ["inventory"] },
  { path: "/saler", roles: ["saler", "supersaler"] },
  { path: "/notallow", roles: ["notallow"] },

  // Menu entries — itens do dashboard
  {
    path: "/saler/orders/new",
    roles: ["supersaler", "saler"],
    menu: {
      label: "Incluir novo Pedido",
      icon: ShoppingCart,
      section: "sales",
    },
  },
  {
    path: "/saler/orders/find",
    roles: ["supersaler", "saler"],
    menu: { label: "Histórico de Pedidos", icon: Calendar, section: "sales" },
  },
  {
    path: "/saler/price-table",
    roles: ["supersaler", "saler"],
    menu: { label: "Tabela de Preços", icon: DollarSign, section: "sales" },
  },
  {
    path: "/saler/performance",
    roles: ["supersaler", "saler"],
    menu: { label: "Análise de Resultados", icon: BarChart3, section: "sales" },
  },
  {
    path: "/saler/customers",
    roles: ["supersaler"],
    menu: { label: "Cadastro de Clientes", icon: ContactRound, section: "sales" },
  },
  {
    path: "/saler/team",
    roles: ["supersaler"],
    menu: { label: "Configurar Equipe", icon: Sliders, section: "sales" },
  },
  {
    path: "/admin/graph",
    roles: ["admin"],
    menu: {
      label: "Dashboard com Gráficos",
      icon: PieChart,
      section: "management",
    },
  },
  {
    path: "/admin/grid",
    roles: ["admin"],
    menu: {
      label: "Pesquisas em Grid",
      icon: Grid2X2Check,
      section: "management",
    },
  },
  {
    path: "/admin/user-pre",
    roles: ["admin"],
    menu: {
      label: "Convidar Usuário",
      icon: UserStar,
      section: "management",
    },
  },
  {
    path: "/admin/users",
    roles: ["admin"],
    menu: {
      label: "Gerenciamento de Usuários",
      icon: UserLock,
      section: "management",
    },
  },
  {
    path: "/buyer/edit",
    roles: ["buyer"],
    menu: {
      label: "Dados do Comprador",
      icon: UserCheck,
      section: "purchasing",
    },
  },
  {
    path: "/buyer/orders",
    roles: ["buyer"],
    menu: { label: "Pedido de Compra", icon: FileText, section: "purchasing" },
  },
  {
    path: "/buyer/orders-history",
    roles: ["buyer"],
    menu: {
      label: "Histórico de Pedidos",
      icon: Calendar,
      section: "purchasing",
    },
  },
] as const satisfies readonly RouteEntry[];

export const PUBLIC_ROUTES = [
  "/auth",
  "/privacy-policy",
  "/terms-of-service",
  "/user-pre",
] as const;

// Apenas prefixes de gating entram em PROTECTED_ROUTES — middleware faz
// `startsWith` e o `find` deve retornar o prefixo certo. Se uma entrada de
// menu (granular) entrasse aqui, dois prefixes poderiam casar para o mesmo
// pathname, com resultado indeterminado.
export const PROTECTED_ROUTES: Readonly<Record<string, readonly UserRole[]>> =
  Object.fromEntries(
    ROUTES.filter((r) => !("menu" in r)).map((r) => [r.path, r.roles]),
  );

export const dashItemsPrivate: DashItem[] = ROUTES.flatMap((r) =>
  "menu" in r
    ? [
        {
          name: r.menu.label,
          routePath: r.path,
          iconComponent: r.menu.icon,
          roles: [...r.roles],
          section: r.menu.section,
        },
      ]
    : [],
);
