import Footer from "@/components/footer/footer";
import HeaderPrivate from "@/components/header/header-private";
import { LoadingFallbackLarge } from "@/components/home/loading-fallback";
import { Suspense } from "react";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HeaderPrivate />
      <Suspense fallback={<LoadingFallbackLarge />}>
        <main className="flex-1 mx-auto w-full max-w-6xl p-3 md:p-4 content-start">
          {children}
        </main>
      </Suspense>
      <Footer />
    </>
  );
}
