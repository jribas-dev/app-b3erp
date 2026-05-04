import { useMemo } from "react";

import { Callout, CalloutTitle, CalloutDescription } from "@/components/ui/callout";
import { dashItemsPrivate } from "@/config/route-registry";
import {
  DASH_SECTION_LABELS,
  DASH_SECTION_ORDER,
  DashItem,
  DashSection,
} from "@/types/dash-item";
import { cn } from "@/lib/utils";

import { MenuItem } from "./menu-item";

interface DashboardMenuProps {
  userRoles?: string[];
  className?: string;
}

export const DashboardMenu: React.FC<DashboardMenuProps> = ({
  userRoles,
  className,
}) => {
  const grouped = useMemo(() => {
    const map = new Map<DashSection, DashItem[]>();
    if (!userRoles || userRoles.length === 0) return map;
    for (const item of dashItemsPrivate) {
      if (!item.roles.some((role) => userRoles.includes(role))) continue;
      const bucket = map.get(item.section) ?? [];
      bucket.push(item);
      map.set(item.section, bucket);
    }
    return map;
  }, [userRoles]);

  const hasAny = useMemo(() => {
    for (const items of grouped.values()) {
      if (items.length > 0) return true;
    }
    return false;
  }, [grouped]);

  if (!hasAny) {
    return (
      <div className={cn("w-full max-w-lg mx-auto px-4", className)}>
        <Callout variant="warning">
          <CalloutTitle>Sem módulos disponíveis</CalloutTitle>
          <CalloutDescription>
            Nenhuma ação liberada para o seu perfil.<br />Entre em contato com o
            administrador.
          </CalloutDescription>
        </Callout>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "w-full max-w-6xl mx-auto px-4 flex flex-col gap-8",
        className
      )}
    >
      {DASH_SECTION_ORDER.map((section) => {
        const items = grouped.get(section);
        if (!items?.length) return null;
        return (
          <section key={section} aria-labelledby={`dash-section-${section}`}>
            <h2
              id={`dash-section-${section}`}
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-1"
            >
              {DASH_SECTION_LABELS[section]}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
              {items.map((item) => (
                <MenuItem key={item.routePath} item={item} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};
