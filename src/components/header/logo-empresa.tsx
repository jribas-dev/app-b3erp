import Image from "next/image";
import Link from "next/link";

type LogoEmpresaProps = {
  dark?: boolean;
};

export default function LogoEmpresa(props: LogoEmpresaProps) {
  const logoClass = props.dark ? "-dark" : "-light";
  return (
    <Link href="/">
    <Image src={`/images/logoB3Erp${logoClass}.png`} alt="Logo" width={100} height={30} />
    </Link>
  );
}