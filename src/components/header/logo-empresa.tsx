import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type LogoEmpresaProps = {
  dark?: boolean;
  privado?: boolean;
};

export default function LogoEmpresa(props: LogoEmpresaProps) {
  function ThemedImage(props: { dark?: boolean }) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
      setIsClient(true);
    }, []);

    if (!isClient) {
      return null; // This component will not render on the server
    }

    const src = props.dark
      ? "/images/logoB3Erp-dark.png"
      : "/images/logoB3Erp-light.png";
    return <Image src={src} alt="Logo" width={100} height={30} priority={true} />;
  }

  const homeRoute = props.privado ? "/home" : "/";

  return (
    <Link href={homeRoute}>
      <ThemedImage {...props} />
    </Link>
  );
}
