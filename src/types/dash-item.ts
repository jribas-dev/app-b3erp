export interface DashItem {
  name: string;
  routePath: string;
  iconComponent: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  roles: string[];
}