export type DashSection = "sales" | "management" | "purchasing" | "inventory";

export interface DashItem {
  name: string;
  routePath: string;
  iconComponent: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  roles: string[];
  section: DashSection;
}

export const DASH_SECTION_ORDER: DashSection[] = [
  "sales",
  "management",
  "purchasing",
  "inventory",
];

export const DASH_SECTION_LABELS: Record<DashSection, string> = {
  sales: "Gestão de Vendas",
  management: "Administrativo",
  purchasing: "Setor de Compras",
  inventory: "Gestão de Estoque",
};
