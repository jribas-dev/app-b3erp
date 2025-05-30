import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1 mx-auto w-full max-w-6xl p-3 md:p-4 content-center">
        {children}
      </main>
      <Footer />
    </>
  );
}
