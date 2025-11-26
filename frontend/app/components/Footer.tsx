// components/Footer.tsx

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          
          {/* LOGO + TEXTE */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Hemut-link</h2>
            <p className="mt-3 text-sm text-gray-600">
              La plateforme dédiée aux professionnels du bâtiment :
              marketplace, missions express et services spécialisés.
            </p>
          </div>

          {/* NAVIGATION */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Navigation</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/" className="hover:text-gray-900 transition">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-gray-900 transition">
                  À propos
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="hover:text-gray-900 transition"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/marketplace"
                  className="hover:text-gray-900 transition"
                >
                  Marketplace
                </Link>
              </li>
              <li>
                <Link
                  href="/hemut-link-go"
                  className="hover:text-gray-900 transition"
                >
                  Hemut-link Go
                </Link>
              </li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Contact</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/contact" className="hover:text-gray-900 transition">
                  Formulaire de contact
                </Link>
              </li>
              <li>
                <a
                  href="mailto:contact@hemut-link.com"
                  className="hover:text-gray-900 transition"
                >
                  contact@hemut-link.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+33600000000"
                  className="hover:text-gray-900 transition"
                >
                  +33 6 00 00 00 00
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* BAS DE PAGE */}
        <div className="mt-12 border-t border-gray-200 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} Hemut-link — Tous droits réservés.
          </p>

          <div className="mt-4 flex space-x-6 sm:mt-0 text-sm text-gray-600">
            <Link href="/mentions-legales" className="hover:text-gray-900">
              Mentions légales
            </Link>
            <Link href="/cgu" className="hover:text-gray-900">
              CGU / CGV
            </Link>
            <Link href="/confidentialite" className="hover:text-gray-900">
              Confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
