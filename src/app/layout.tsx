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

const montserrat = Montserrat({ subsets: ["latin"], display: "swap" });

// Métadonnées globales, y compris les favicons
export const metadata: Metadata = {
  title: "Podomus - L'Art du Soin Podologique",
  description:
    "Des soins sur-mesure, innovants et confidentiels, orchestrés par la Docteure Sonda Affes Ben Mahmoud. L'excellence podologique, tout simplement.",
  keywords:
    "podologie, soins podologiques, cabinet podologue, Docteure Sonda Affes Ben Mahmoud, orthoplastie, orthonyxie, traitement laser, soins des pieds, podologue Tunisie, santé des pieds, soins personnalisés, innovation podologique, cabinet de luxe, soins confidentiels, excellence podologique",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <Analytics />
        <SpeedInsights />
      </head>
      <body className={`${montserrat.className} bg-mainbg text-textmain`}>
        <UIProvider>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </UIProvider>
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
