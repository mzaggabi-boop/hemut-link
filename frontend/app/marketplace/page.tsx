// app/marketplace/page.tsx

import Link from "next/link";

export const metadata = {
  title: "Marketplace — Hemut-link",
  description:
    "Découvrez la marketplace Hemut-link : un espace dédié aux professionnels du bâtiment pour acheter et vendre du matériel en toute simplicité.",
};

export default function MarketplacePublicPage() {
  return (
    <main className="bg-white pt-20 pb-24">
      <div className="mx-auto max-w-6xl px-6">

        {/* HEADER */}
        <header className="text-center mb-16">
          <h1 className="text-3xl font-bold text-gray-900">
            Marketplace Hemut-link
          </h1>
          <p className="mt-4 text-gray-600 text-sm max-w-2xl mx-auto">
            La première marketplace dédiée exclusivement aux professionnels du bâtiment :
            matériel neuf, matériel d’occasion, accessoires, consommables,
            outillage spécialisé et équipements professionnels.
          </p>
        </header>

        {/* SECTION PRESENTATION */}
        <section className="mb-20 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="p-6 rounded-xl border border-gray-200 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Une plateforme pensée pour les pros
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Retrouvez en quelques secondes le matériel dont vous avez besoin.
              Publiez vos annonces facilement, achetez en toute sécurité grâce
              à notre système de paiement Stripe Connect, et bénéficiez d’une
              communauté active de professionnels.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-gray-200 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Matériel neuf ou d’occasion
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Que vous cherchiez du matériel neuf à bon prix ou de l’occasion
              vérifiée par des pros, la marketplace Hemut-link centralise
              l’ensemble du matériel essentiel au bâtiment.
            </p>
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="mb-20">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            Catégories principales
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {[
              "Outils",
              "Équipements",
              "Matériaux",
              "Électricité",
              "Plomberie",
              "Peinture",
              "Menuiserie",
              "Divers",
            ].map((cat) => (
              <div
                key={cat}
                className="flex items-center justify-center p-4 rounded-lg border border-gray-200 bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
              >
                {cat}
              </div>
            ))}
          </div>
        </section>

        {/* CTA INSCRIPTION */}
        <section className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Publiez vos annonces dès maintenant
          </h2>
          <p className="text-gray-600 text-sm mb-6">
            Créez un compte professionnel pour accéder à toutes les fonctionnalités.
          </p>

          <div className="flex justify-center gap-4">
            <Link
              href="/login"
              className="px-5 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-black transition"
            >
              Se connecter
            </Link>

            <Link
              href="/register"
              className="px-5 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition"
            >
              Créer un compte
            </Link>
          </div>
        </section>

      </div>
    </main>
  );
}
