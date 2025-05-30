import { Roboto, IBM_Plex_Serif } from "next/font/google";

export const robotoFont = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const ibmPlexSansFont = IBM_Plex_Serif({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
});
