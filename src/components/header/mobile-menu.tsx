"use client";

import { useState } from "react";
import Link from "next/link";
import { X, ChevronRight } from "lucide-react";
import LogoEmpresa from "./logo-empresa";

interface SubMenuItem {
  name: string;
  routePath: string;
}

interface MenuItem {
  name: string;
  routePath?: string;
  hasSubmenu: boolean;
  subMenuItems?: SubMenuItem[];
}

interface SubmenuButtonProps {
  isOpen: boolean;
  onClick: (e: React.MouseEvent) => void;
  ariaLabel: string;
}

interface MenuItemComponentProps {
  item: MenuItem;
  isSubmenuOpen: boolean;
  toggleSubmenu: () => void;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
}

const SubmenuButton = ({ isOpen, onClick, ariaLabel }: SubmenuButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      aria-expanded={isOpen}
      className="p-2 rounded-(--radius) z-10 relative
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground"
    >
      <span
        aria-hidden="true"
        className={`transition-transform duration-200 ${
          isOpen ? "rotate-90" : ""
        } block`}
      >
        <ChevronRight width={20} height={20} />
      </span>
    </button>
  );
};

const SubMenu = ({
  subMenuItems,
  onItemClick,
}: {
  subMenuItems: SubMenuItem[];
  onItemClick: () => void;
}) => {
  return (
    <div className="ml-4 border-l-2 border-primary-foreground/40 pl-4">
      {subMenuItems.map((subItem, index) => (
        <div key={index} className="submenu-item text-primary-foreground py-2">
          <Link href={subItem.routePath} onClick={onItemClick}>
            {subItem.name}
          </Link>
        </div>
      ))}
    </div>
  );
};

const MenuItemComponent = ({
  item,
  isSubmenuOpen,
  toggleSubmenu,
  onItemClick,
}: MenuItemComponentProps & { onItemClick: () => void }) => {
  if (item.hasSubmenu) {
    return (
      <div>
        <div
          className="flex justify-between items-center py-3 text-primary-foreground cursor-pointer"
          onClick={toggleSubmenu}
        >
          <span className="flex-1">{item.name}</span>
          <SubmenuButton
            isOpen={isSubmenuOpen}
            onClick={(e) => {
              e.stopPropagation();
              toggleSubmenu();
            }}
            ariaLabel={`${isSubmenuOpen ? "Recolher" : "Expandir"} submenu ${
              item.name
            }`}
          />
        </div>
        {isSubmenuOpen && item.subMenuItems && (
          <SubMenu subMenuItems={item.subMenuItems} onItemClick={onItemClick} />
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.routePath || "#"}
      className="block"
      onClick={onItemClick}
    >
      <div className="py-3 text-primary-foreground cursor-pointer">
        {item.name}
      </div>
    </Link>
  );
};

export default function MobileMenu({
  isOpen,
  onClose,
  menuItems,
}: MobileMenuProps) {
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>(
    menuItems.reduce((acc, item) => {
      if (item.hasSubmenu) {
        acc[item.name] = false;
      }
      return acc;
    }, {} as Record<string, boolean>)
  );

  const toggleSubmenu = (menuName: string) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
  };

  return (
    <div
      className={`fixed inset-0 bg-primary text-primary-foreground z-50 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 md:hidden`}
    >
      <div className="p-4 flex justify-between">
        <div className="text-2xl font-bold" onClick={onClose}>
          <span className="sr-only">B3Erp</span>
          <LogoEmpresa dark={true} />
        </div>
        <button
          type="button"
          className="rounded-(--radius) p-1
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground"
          onClick={onClose}
          aria-label="Fechar menu"
        >
          <X width={24} height={24} />
        </button>
      </div>
      <nav className="p-4">
        {menuItems.map((item, index) => (
          <MenuItemComponent
            key={index}
            item={item}
            isSubmenuOpen={item.hasSubmenu ? openSubmenus[item.name] : false}
            toggleSubmenu={() => toggleSubmenu(item.name)}
            onItemClick={onClose}
          />
        ))}
      </nav>
    </div>
  );
}
