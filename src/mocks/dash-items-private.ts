import { 
  Users, 
  ShoppingCart, 
  Calendar, 
  DollarSign, 
  BarChart3, 
  Truck, 
  Sliders, 
  PieChart, 
  UserCheck, 
  FileText 
} from "lucide-react";
import { DashItem } from "@/types/dash-item";

export const dashItemsPrivate: DashItem[] = [
  {
    name: "Lista de Clientes",
    routePath: "/super/clients",
    iconComponent: Users,
    roles: ["supervisor"],
  },
  {
    name: "Lançamento de Pedidos",
    routePath: "/saler/orders",
    iconComponent: ShoppingCart,
    roles: ["supervisor", "saler"],
  },
  {
    name: "Histórico de Pedidos",
    routePath: "/saler/orders-history",
    iconComponent: Calendar,
    roles: ["supervisor", "saler"],
  },
  {
    name: "Tabela de Preços",
    routePath: "/saler/price-table",
    iconComponent: DollarSign,
    roles: ["supervisor", "saler"],
  },
  {
    name: "Analisar meu desempenho",
    routePath: "/saler/performance",
    iconComponent: BarChart3,
    roles: ["supervisor", "saler"],
  },
  {
    name: "Configurar Equipe",
    routePath: "/super/team",
    iconComponent: Sliders,
    roles: ["supervisor"],
  },
  {
    name: "Configurar Rota",
    routePath: "/super/routes",
    iconComponent: Truck,
    roles: ["supervisor"],
  },
  {
    name: "Analisar minha equipe",
    routePath: "/super/team-performance",
    iconComponent: PieChart,
    roles: ["supervisor"],
  },
  {
    name: "Dados do Comprador",
    routePath: "/buyer/edit",
    iconComponent: UserCheck,
    roles: ["buyer"],
  },
  {
    name: "Pedido de Compra",
    routePath: "/buyer/orders",
    iconComponent: FileText,
    roles: ["buyer"],
  },
  {
    name: "Histórico de Pedidos",
    routePath: "/buyer/orders-history",
    iconComponent: Calendar,
    roles: ["buyer"],
  },
];