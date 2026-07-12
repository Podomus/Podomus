import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import UIProvider from "@/providers/UIProvider";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import ConditionalLayout from "@/components/ConditionalLayout";
import { VisualEditing } from "next-sanity/visual-editing";
import { SanityLive } from "@/sanity/lib/live";
import { DisableDraftMode } from "@/components/DisableDraftMode";
import { draftMode } from "next/headers";
import { LocalBusinessJsonLd } from "@/components/JsonLd";
import { I18nProvider } from "@/providers/I18nProvider";
import { getServerLocale, getServerTranslations } from "@/i18n/getLocale";
import { defaultLocale } from "@/i18n/config";

const montserrat = Montserrat({ subsets: ["latin"], display: "swap" });

const BASE_URL = "https://podomus.tn"

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Podomus — Podologue à La Soukra | Soins Podologiques de Précision | Sonda Affes",
    template: "%s | Podomus",
  },
  description:
    "Cabinet de podologie de précision dirigé par Sonda Affes Ben Mahmoud, formée chez Bastien Gonzalez (Maldives, Dubaï). Orthoplastie, orthonyxie, laser — à La Soukra, Ariana.",
  keywords:
    "podologue La Soukra, podologue Ariana, podologue Tunis, Sonda Affes Ben Mahmoud, podologie précision, orthoplastie, orthonyxie, traitement laser podologie, soins pieds Tunisie, cabinet podologue, Bastien Gonzalez",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Podomus",
    url: BASE_URL,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getServerLocale()
  const translations = await getServerTranslations()

  return (
    <html lang={locale} className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <LocalBusinessJsonLd />
        <Analytics />
        <SpeedInsights />
      </head>
      <body className={`${montserrat.className} bg-mainbg text-textmain`}>
        <I18nProvider translations={translations}>
          <UIProvider>
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
          </UIProvider>
        </I18nProvider>
        <SanityLive />
        {(await draftMode()).isEnabled && (
          <>
            <VisualEditing />
            <DisableDraftMode />
          </>
        )}
      </body>
    </html>
  );
}
