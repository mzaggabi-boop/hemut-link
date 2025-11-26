// app/hemut-link-go/page.tsx

import Link from "next/link";

export const metadata = {
  title: "Hemut-link Go — Missions Express",
  description:
    "Hemut-link Go est le service de missions express entre artisans : dépannage urgent, transport de matériel, entraide professionnelle et interventions rapides.",
};

export default function GoPage() {
  return (
    <main className="bg-white pt-20 pb-24">
      <div className="mx-auto max-w-6xl px-6">

        {/* HEADER */}
        <header className="text-center mb-16">
          <h1 className="text-3xl font-bold text-gray-900">
            Hemut-link Go — Missions Express
          </h1>
          <p className="mt-4 text-gray-600 text-sm max-w-2xl mx-auto">
            Le service d’entraide entre professionnels du bâtiment :
            dépannage rapide, transport de matériel, interventions d’urgence
            et missions ponctuelles. Une communauté active prête à vous aider.
          </p>
        </header>

        {/* SECTIONS */}
        <section className="mb-20 grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Bloc 1 */}
          <div className="p-6 rounded-xl border border-gray-200 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Dépannage urgent entre artisans
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Un imprévu ? Une machine en panne ? Un besoin urgent de main-d'œuvre ?
              Hemut-link Go vous permet de demander de l’aide en quelques clics
              aux artisans proches de vous.
            </p>
          </div>

          {/* Bloc 2 */}
          <div className="p-6 rounded-xl border border-gray-200 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Transport de matériel
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Faites transporter du matériel d’un chantier à un autre ou depuis
              un fournisseur, grâce à des pros déjà en déplacement dans votre zone.
            </p>
          </div>

          {/* Bloc 3 */}
          <div className="p-6 rounded-xl border border-gray-200 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Interventions ponctuelles
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Besoin d'une aide rapide pour une tâche spécifique ? Demandez une
              mission ponctuelle à un autre professionnel disponible immédiatement.
            </p>
          </div>

          {/* Bloc 4 */}
          <div className="p-6 rounded-xl border border-gray-200 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Une communauté active
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Hemut-link Go fonctionne grâce à l’entraide et à la solidarité
              entre artisans : un réseau réactif, efficace et fiable.
            </p>
          </div>
        </section>

        {/* COMMENT ÇA MARCHE */}
        <section className="mb-20">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            Comment ça marche ?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">

            <div className="text-center">
              <div className="w-12 h-12 mx-auto flex items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-lg">
                1
              </div>
              <h3 className="mt-4 text-sm font-semibold text-gray-900">
                Publiez une mission
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Décrivez votre besoin : urgence, transport, intervention…
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 mx-auto flex items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-lg">
                2
              </div>
              <h3 className="mt-4 text-sm font-semibold text-gray-900">
                Trouvez un pro disponible
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Les artisans proches reçoivent votre demande et répondent.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 mx-auto flex items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-lg">
                3
              </div>
              <h3 className="mt-4 text-sm font-semibold text-gray-900">
                Payez en toute sécurité
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Paiement sécurisé via Stripe pour garantir des missions fiables.
              </p>
            </div>

          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Lancez votre première mission express
          </h2>
          <p className="text-gray-600 text-sm mb-6">
            Entrez dans la communauté Hemut-link Go : rapide, fiable et efficace.
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
