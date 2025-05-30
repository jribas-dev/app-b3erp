"use client";

import { useState } from "react";
import Link from "next/link";
import { IoMdClose } from "react-icons/io";
import { RiArrowRightSLine } from "react-icons/ri";
import LogoEmpresa from "./logo-empresa";

// Interface para os subitens do menu
interface SubMenuItem {
  name: string;
  routePath: string;
}

// Interface para os itens do menu
interface MenuItem {
  name: string;
  routePath?: string;
  hasSubmenu: boolean;
  subMenuItems?: SubMenuItem[];
}

// Interface para o componente de botão de submenu
interface SubmenuButtonProps {
  isOpen: boolean;
  onClick: (e: React.MouseEvent) => void;
  ariaLabel: string;
}

// Interface para o componente de item de menu
interface MenuItemComponentProps {
  item: MenuItem;
  isSubmenuOpen: boolean;
  toggleSubmenu: () => void;
}

// Interface para o componente principal de menu móvel
interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
}

// Componente para o botão que abre/fecha o submenu
const SubmenuButton = ({ isOpen, onClick, ariaLabel }: SubmenuButtonProps) => {
  return (
    <button 
      onClick={onClick}
      aria-label={ariaLabel}
      className="p-2 focus:outline-none z-10 relative"
    >
      <span className={`transition-transform ${isOpen ? "rotate-90" : ""} block`}>
        <RiArrowRightSLine size={20} />
      </span>
    </button>
  );
};

// Componente para o submenu
const SubMenu = ({ subMenuItems, onItemClick }: { 
  subMenuItems: SubMenuItem[],
  onItemClick: () => void  
}) => {
  return (
    <div className="ml-4 border-l-2 border-blue-400 pl-4">
      {subMenuItems.map((subItem, index) => (
        <div key={index} className="submenu-item text-gray-100 py-2">
          <Link 
            href={subItem.routePath} 
            onClick={onItemClick} // Fecha o menu quando clicar em um item
          >
            {subItem.name}
          </Link>
        </div>
      ))}
    </div>
  );
};

// Componente para cada item do menu
const MenuItemComponent = ({ 
  item, 
  isSubmenuOpen, 
  toggleSubmenu,
  onItemClick 
}: MenuItemComponentProps & { onItemClick: () => void }) => {
  if (item.hasSubmenu) {
    return (
      <div>
        <div 
          className="flex justify-between items-center py-3 text-white cursor-pointer" 
          onClick={toggleSubmenu}
        >
          <span className="flex-1">{item.name}</span>
          <SubmenuButton 
            isOpen={isSubmenuOpen}
            onClick={(e) => {
              e.stopPropagation(); // Evita duplo clique quando o botão é clicado
              toggleSubmenu();
            }}
            ariaLabel={`${isSubmenuOpen ? "Collapse" : "Expand"} ${item.name} submenu`}
          />
        </div>
        {isSubmenuOpen && item.subMenuItems && (
          <SubMenu 
            subMenuItems={item.subMenuItems} 
            onItemClick={onItemClick}
          />
        )}
      </div>
    );
  } else {
    return (
      <Link 
        href={item.routePath || "#"} 
        className="block"
        onClick={onItemClick} // Fecha o menu quando clicar em um item
      >
        <div className="py-3 text-white cursor-pointer">
          {item.name}
        </div>
      </Link>
    );
  }
};

// Componente principal de menu móvel
export default function MobileMenu({ isOpen, onClose, menuItems }: MobileMenuProps) {
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
      className={`fixed inset-0 bg-primary z-50 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-333 md:hidden`}
    >
      <div className="p-4 flex justify-between">
        <div className="text-white text-2xl font-bold" onClick={onClose}>
          <span className="sr-only">B3Erp</span>
          <LogoEmpresa dark={true} />
        </div>
        <button 
          className="text-white text-2xl"
          onClick={onClose}
          aria-label="Close menu"
        >
          <IoMdClose />
        </button>
      </div>
      <nav className="p-4">
        {menuItems.map((item, index) => (
          <MenuItemComponent
            key={index}
            item={item}
            isSubmenuOpen={item.hasSubmenu ? openSubmenus[item.name] : false}
            toggleSubmenu={() => toggleSubmenu(item.name)}
            onItemClick={onClose} // Fecha o menu quando clicar em qualquer item
          />
        ))}
      </nav>
    </div>
  );
}