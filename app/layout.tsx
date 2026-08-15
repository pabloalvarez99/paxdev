import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { KeyboardNav } from "@/components/keyboard-nav";
import { jumpTargets } from "@/content/jump";
import portfolio from "@/content/portfolio";

import { serif } from "./fonts";
import "./globals.css";

const { site } = portfolio;

export const metadata: Metadata = {
  metadataBase: new URL(site.canonicalUrl),
  title: {
    default: `${site.owner} — ${site.role}`,
    template: `%s — ${site.name}`,
  },
  description:
    "Public AI systems with repositories, tests, and honest scope, by Pablo Alvarez.",
  applicationName: site.name,
  authors: [{ name: site.owner, url: site.githubUrl }],
  creator: site.owner,
  publisher: site.owner,
  keywords: [
    "AI Engineer",
    "LLM Engineer",
    "RAG",
    "Agentic AI",
    "FastAPI",
    "Rust",
    "Next.js",
    "Product Engineering",
    "Chile",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    title: `${site.owner} — ${site.role}`,
    description:
      "AI systems that show their work: grounded retrieval, bounded agents, and honest scope.",
    siteName: site.name,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.owner} — ${site.role}`,
    description: "Public AI systems, hosted demos, and evidence behind every claim.",
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
    <html className={serif.variable} lang="en">
      <body>
        {children}
        {/* The keyboard map is the same on every page, so it is bound once, here. */}
        <KeyboardNav targets={jumpTargets} />
      </body>
    </html>
  );
}
