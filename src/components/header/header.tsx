"use client";

import { useState } from "react";
import { FiMenu } from "react-icons/fi";
import MobileMenu from "./mobile-menu";
import LogoEmpresa from "./logo-empresa";
import { menuItemsPublic } from "@/mocks/menu-items-public";
import DesktopMenu from "./desktop-menu";
import { useTheme } from "next-themes";
import { ThemeDropDown } from "../home/theme-dropdown";

export default function Header() {
  const {resolvedTheme} = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = menuItemsPublic;

  const openMobileMenu = () => setIsMobileMenuOpen(true);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <header className="p-3 flex justify-between items-center border-b animate-in fade-in slide-in-from-top duration-500">
        <div className="text-2xl font-bold">
          <LogoEmpresa dark={resolvedTheme==="dark" ? true : false} />
        </div>
        <div className="flex items-center">
          {/* Menu Desktop */}
          <DesktopMenu menuItems={menuItems} />
          
          {/* Botão hamburguer para abrir menu mobile */}
          <button
            className="md:hidden text-2xl mr-6"
            onClick={openMobileMenu}
            aria-label="Toggle menu"
          >
            <FiMenu />
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
