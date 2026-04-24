export type DashSection = "sales" | "management" | "purchasing" | "account";

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
  "account",
];

export const DASH_SECTION_LABELS: Record<DashSection, string> = {
  sales: "Vendas",
  management: "Gestão da Equipe",
  purchasing: "Compras",
  account: "Minha Conta",
};
