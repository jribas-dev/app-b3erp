"use client";

import { useTheme } from "next-themes";
import { ThemeDropDown } from "../home/theme-dropdown";
import UserDropDown from "../home/user-dropdown";
import { HeaderInstanceChip } from "./header-instance-chip";
import LogoEmpresa from "./logo-empresa";

export default function HeaderPrivate() {
  const { resolvedTheme } = useTheme();
  return (
    <>
      <header className="p-3 flex justify-between items-center gap-2 border-b">
        <div className="text-2xl font-bold shrink-0">
          <LogoEmpresa dark={resolvedTheme==="dark" ? true : false} privado={true} />
        </div>
        <div className="flex-1 flex justify-center min-w-0">
          <HeaderInstanceChip />
        </div>
        <div className="flex items-center gap-x-6 shrink-0">
          <UserDropDown />
          <ThemeDropDown />
        </div>
      </header>
    </>
  );
}
