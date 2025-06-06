import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import { Suspense } from "react";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1 mx-auto w-full max-w-6xl p-3 md:p-4 content-center">
        <Suspense fallback={<div className="text-center">Carregando...</div>}>
          {children}
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
