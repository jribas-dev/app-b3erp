"use client";

import { useState } from "react";
import { FiMenu } from "react-icons/fi";
import MobileMenu from "./mobile-menu";
import LogoEmpresa from "./logo-empresa";
import { menuItemsPuclic } from "@/mocks/menu-items-public";
import DesktopMenu from "./desktop-menu";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = menuItemsPuclic;

  const openMobileMenu = () => setIsMobileMenuOpen(true);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <header className="bg-gray-100 p-3 flex justify-between items-center">
        <div className="text-2xl font-bold">
          <LogoEmpresa dark={false} />
        </div>
        <div className="flex items-center">
          {/* Menu Desktop */}
          <DesktopMenu menuItems={menuItems} />
          
          {/* Botão hamburguer para abrir menu mobile */}
          <button
            className="md:hidden text-2xl"
            onClick={openMobileMenu}
            aria-label="Toggle menu"
          >
            <FiMenu />
          </button>
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
