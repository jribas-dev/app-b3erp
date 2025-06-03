import Footer from "@/components/footer/footer";
import HeaderPrivate from "@/components/header/header-private";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HeaderPrivate />
      <main className="flex-1 mx-auto w-full max-w-6xl p-3 md:p-4 content-start">
        {children}
      </main>
      <Footer />
    </>
  );
}
