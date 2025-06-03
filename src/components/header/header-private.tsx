"use client";

import { useTheme } from "next-themes";
import { ThemeDropDown } from "../home/theme-dropdown";
import UserDropDown from "../home/user-dropdown";
import LogoEmpresa from "./logo-empresa";

export default function HeaderPrivate() {
  const { resolvedTheme } = useTheme();
  return (
    <>
      <header className="bg-gray-200 dark:bg-gray-800 p-3 flex justify-between items-center border-b">
        <div className="text-2xl font-bold">
          <LogoEmpresa dark={resolvedTheme==="dark" ? true : false} privado={true} />
        </div>
        <div className="flex items-center gap-x-6">
          <UserDropDown />
          <ThemeDropDown />
        </div>
      </header>
    </>
  );
}
