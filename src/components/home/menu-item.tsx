import Link from "next/link";

import { DashItem } from "@/types/dash-item";

interface MenuItemProps {
  item: DashItem;
}

export const MenuItem: React.FC<MenuItemProps> = ({ item }) => {
  const IconComponent = item.iconComponent;

  return (
    <Link
      href={item.routePath}
      aria-label={`Abrir módulo ${item.name}`}
      className="group flex flex-col items-center justify-center gap-3 text-center
                 bg-card text-card-foreground border border-border
                 rounded-[calc(var(--radius)*3)]
                 p-5 min-h-28 shadow-sm
                 transition-all duration-200
                 hover:shadow-md hover:border-primary/40 hover:-translate-y-0.5
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary
                 focus-visible:ring-offset-2 focus-visible:ring-offset-background
                 active:translate-y-0 active:shadow-sm
                 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <span
        aria-hidden="true"
        className="flex items-center justify-center w-11 h-11 rounded-full
                   bg-primary/10 text-primary
                   transition-colors duration-200
                   group-hover:bg-primary/15"
      >
        <IconComponent width={20} height={20} />
      </span>
      <span className="text-sm font-medium text-foreground leading-tight text-pretty">
        {item.name}
      </span>
    </Link>
  );
};
