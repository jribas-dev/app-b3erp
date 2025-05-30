"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { RiArrowDownSLine } from "react-icons/ri";

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

// Interface para o componente principal de menu desktop
interface DesktopMenuProps {
  menuItems: MenuItem[];
}

// Componente para o dropdown de submenu
const SubmenuDropdown = ({
  isOpen,
  subMenuItems,
  onClose,
}: {
  isOpen: boolean;
  subMenuItems: SubMenuItem[];
  onClose: () => void;
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fechar dropdown quando clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-md py-2 min-w-max z-50"
    >
      {subMenuItems.map((subItem, index) => (
        <Link
          key={index}
          href={subItem.routePath}
          className="block px-4 py-2 text-gray-800 hover:bg-gray-100 whitespace-nowrap"
          onClick={onClose}
          target={subItem.routePath.includes("http") ? "_blank" : "_self"}
          rel={subItem.routePath.includes("http") ? "noopener noreferrer" : undefined}
        >
          {subItem.name}
        </Link>
      ))}
    </div>
  );
};

// Componente para cada item do menu desktop
const DesktopMenuItem = ({ item }: { item: MenuItem }) => {
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  const menuItemRef = useRef<HTMLDivElement>(null);

  const toggleSubmenu = () => {
    setIsSubmenuOpen(!isSubmenuOpen);
  };

  const closeSubmenu = () => {
    setIsSubmenuOpen(false);
  };

  if (item.hasSubmenu && item.subMenuItems && item.subMenuItems.length > 0) {
    return (
      <div ref={menuItemRef} className="relative">
        <div
          className="flex items-center space-x-1 cursor-pointer nav-link"
          onClick={toggleSubmenu}
        >
          <span>{item.name}</span>
          <RiArrowDownSLine
            className={`transition-transform ${
              isSubmenuOpen ? "rotate-180" : ""
            }`}
          />
        </div>
        <SubmenuDropdown
          isOpen={isSubmenuOpen}
          subMenuItems={item.subMenuItems}
          onClose={closeSubmenu}
        />
      </div>
    );
  } else {
    return (
      <Link
        href={item.routePath || "#"}
        className="nav-link"
        target={item.routePath?.includes("http") ? "_blank" : "_self"}
        rel={item.routePath?.includes("http") ? "noopener noreferrer" : undefined}
      >
        {item.name}
      </Link>
    );
  }
};

// Componente principal de menu desktop
export default function DesktopMenu({ menuItems }: DesktopMenuProps) {
  return (
    <nav className="hidden md:flex space-x-6 items-center">
      {menuItems.map((item, index) => (
        <DesktopMenuItem key={index} item={item} />
      ))}
    </nav>
  );
}
