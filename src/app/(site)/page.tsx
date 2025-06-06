import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="container px-1 md:px-4 md:py-8">
      <div className="flex flex-col md:flex-row md:items-center">
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Impulsione sua empresa
          </h1>
          <p className="mb-8 text-blue-600 text-xl font-bold md:text-2xl">
            Utilizando nossas ferramentas de gestão, administração e automação.
          </p>
          <p className="mb-4 text-sm md:text-lg md:text-justify">
            Nosso lema é tornar as tarefas complexas o mais simples possível.
            Automatize seus processos em poucos cliques!
          </p>
          <p className="mb-8 text-sm md:text-lg md:text-justify">
            Desenvolvido para os setores do comércio, indústria e serviços,
            integrando todos os processos do dia a dia da sua empresa.
          </p>
          <Link href="/auth/login">
          <button className="mb-8 btn-primary cursor-pointer shadow-md">FAZER LOGIN</button>
          </Link>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <div className="flex-col items-center justify-center">
            <div className="rounded-md md:p-4 place-items-center">
              <Image
                src="/images/hero-illustration.png"
                alt="Ilustração de gestão empresarial"
                width={300}
                height={435}
                className="w-8/12 md:w-full"
                priority={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
