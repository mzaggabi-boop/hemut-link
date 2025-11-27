// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: {
    default: "Hemut-link — Plateforme professionnelle du bâtiment",
    template: "%s — Hemut-link",
  },
  description:
    "Hemut-link : Marketplace, missions express, conciergerie, outils et services dédiés aux professionnels du bâtiment.",
  keywords: [
    "bâtiment",
    "marketplace",
    "artisans",
    "matériel",
    "missions express",
    "conciergerie",
    "professionnels",
    "chantier",
  ],
  robots: "index, follow",

  openGraph: {
    type: "website",
    locale: "fr_FR",
    title: "Hemut-link — Plateforme professionnelle du bâtiment",
    description:
      "Hemut-link connecte les artisans, fournisseurs et professionnels du bâtiment autour d'une marketplace moderne et de services spécialisés.",
    url: "https://www.hemut-link.com",
    siteName: "Hemut-link",
  },

  twitter: {
    card: "summary_large_image",
    title: "Hemut-link — Plateforme du bâtiment",
    description:
      "Marketplace, missions express, conciergerie et services professionnels.",
  },

  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className="bg-white text-gray-900 antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
