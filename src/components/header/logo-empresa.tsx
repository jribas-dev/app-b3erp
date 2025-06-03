"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

type LogoEmpresaProps = {
  dark?: boolean;
  privado?: boolean;
};

export default function LogoEmpresa(props: LogoEmpresaProps) {
  const homeRoute = props.privado ? "/home" : "/";
  const { theme } = useTheme();
  let logoClass = props.dark ? "-dark" : "-light";
  if (theme === "dark") {
    logoClass = "-dark";
  }
  return (
    <Link href={homeRoute} >
    <Image src={`/images/logoB3Erp${logoClass}.png`} alt="Logo" width={100} height={30} />
    </Link>
  );
}