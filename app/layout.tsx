import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { KeyboardNav } from "@/components/keyboard-nav";
import { jumpTargets } from "@/content/jump";
import portfolio from "@/content/portfolio";

import { sourceSerif } from "./fonts";
import "./globals.css";

const { site } = portfolio;

export const metadata: Metadata = {
  metadataBase: new URL(site.canonicalUrl),
  title: {
    default: `${site.owner} — ${site.role}`,
    template: `%s — ${site.name}`,
  },
  description: `Sistemas de inteligencia artificial públicos, con repositorio, pruebas automáticas y alcance honesto, hechos por ${site.owner}.`,
  applicationName: site.name,
  authors: [{ name: site.owner, url: site.githubUrl }],
  creator: site.owner,
  publisher: site.owner,
  keywords: [
    "Ingeniero de IA",
    "Ingeniería de sistemas LLM",
    "RAG",
    "Agentes de IA",
    "FastAPI",
    "Rust",
    "Next.js",
    "Ingeniería de producto",
    "Chile",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    title: `${site.owner} — ${site.role}`,
    description:
      "Sistemas de inteligencia artificial que muestran cómo funcionan: respuestas basadas en documentos reales, agentes con límites definidos, y alcance explicado con honestidad.",
    siteName: site.name,
    locale: "es_419",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.owner} — ${site.role}`,
    description:
      "Sistemas de inteligencia artificial públicos, demostraciones activas, y evidencia detrás de cada afirmación.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#F7F4ED",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html className={sourceSerif.variable} lang="es">
      <body>
        {children}
        {/* The keyboard map is the same on every page, so it is bound once, here. */}
        <KeyboardNav targets={jumpTargets} />
      </body>
    </html>
  );
}
