import type { Metadata } from "next";
import "./globals.css";
import { ibmPlexSansFont, robotoFont } from "@/fonts/fonts-app";

export const metadata: Metadata = {
  title: "B3Erp - WebApp",
  description: "Sistema Integrado de Gestão Empresarial",
  other: {
    "apple-mobile-web-app-title": "B3Erp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body
        className={`flex flex-col min-h-svh ${robotoFont.variable} ${ibmPlexSansFont.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
