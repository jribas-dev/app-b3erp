import type { Metadata } from "next";
import "./globals.css";
import { ibmPlexSansFont, robotoFont } from "@/fonts/fonts-app";
import { ThemeProvider } from "@/components/theme-provider";

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
    <html lang="pt-BR" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`flex flex-col min-h-svh ${robotoFont.variable} ${ibmPlexSansFont.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
