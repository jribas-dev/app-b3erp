"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import MobileMenu from "./mobile-menu";
import LogoEmpresa from "./logo-empresa";
import { menuItemsPublic } from "@/mocks/menu-items-public";
import DesktopMenu from "./desktop-menu";
import { useTheme } from "next-themes";
import { ThemeDropDown } from "../home/theme-dropdown";

export default function Header() {
  const { resolvedTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = menuItemsPublic;

  const openMobileMenu = () => setIsMobileMenuOpen(true);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <header className="p-3 flex justify-between items-center border-b animate-in fade-in slide-in-from-top duration-300">
        <div className="text-2xl font-bold">
          <LogoEmpresa dark={resolvedTheme === "dark"} />
        </div>
        <div className="flex items-center">
          <DesktopMenu menuItems={menuItems} />

          <button
            type="button"
            className="md:hidden mr-4 p-2 rounded-(--radius)
                       text-foreground
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            onClick={openMobileMenu}
            aria-label="Abrir menu"
          >
            <Menu width={24} height={24} />
          </button>
          <ThemeDropDown />
        </div>
      </header>
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
        menuItems={menuItems}
      />
    </>
  );
}
