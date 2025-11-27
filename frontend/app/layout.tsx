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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
