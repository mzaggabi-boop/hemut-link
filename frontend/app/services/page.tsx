// app/services/page.tsx

export const metadata = {
  title: "Services — Hemut-link",
  description:
    "Découvrez les services proposés par Hemut-link : marketplace, missions express, conciergerie, solutions de paiement, et outils dédiés aux professionnels du bâtiment.",
};

export default function ServicesPage() {
  return (
    <main className="bg-white pt-20 pb-24">
      <div className="mx-auto max-w-5xl px-6">
        
        {/* HEADER */}
        <header className="text-center mb-16">
          <h1 className="text-3xl font-bold text-gray-900">
            Nos Services
          </h1>
          <p className="mt-4 text-gray-600 text-sm max-w-2xl mx-auto">
            Hemut-link réunit en une seule plateforme les outils essentiels
            pour les professionnels du bâtiment : achat, vente, dépannage,
            gestion et collaboration.
          </p>
        </header>

        {/* GRID SERVICES */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

          {/* Marketplace */}
          <div className="p-6 rounded-lg border border-gray-200 bg-gray-50 hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-gray-900">
              Marketplace
            </h3>
            <p className="mt-3 text-sm text-gray-600 leading-relaxed">
              Achetez et vendez du matériel professionnel en toute simplicité.
              Un espace sécurisé dédié aux artisans et fournisseurs.
            </p>
          </div>

          {/* Hemut-link Go */}
          <div className="p-6 rounded-lg border border-gray-200 bg-gray-50 hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-gray-900">
              Hemut-link Go
            </h3>
            <p className="mt-3 text-sm text-gray-600 leading-relaxed">
              Missions express entre artisans : entraide, dépannage urgent,
              transport de matériel et interventions rapides.
            </p>
          </div>

          {/* Paiements sécurisés */}
          <div className="p-6 rounded-lg border border-gray-200 bg-gray-50 hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-gray-900">
              Paiements sécurisés
            </h3>
            <p className="mt-3 text-sm text-gray-600 leading-relaxed">
              Grâce à Stripe Connect, vos transactions sont protégées, simples
              et rapides. Gestion des virements et paiements entre pros.
            </p>
          </div>

          {/* Conciergerie */}
          <div className="p-6 rounded-lg border border-gray-200 bg-gray-50 hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-gray-900">
              Conciergerie (bientôt)
            </h3>
            <p className="mt-3 text-sm text-gray-600 leading-relaxed">
              Un service complet pour la remise en état, les interventions
              ponctuelles et l’accompagnement des locations courte durée.
            </p>
          </div>

          {/* Gestion d’activité */}
          <div className="p-6 rounded-lg border border-gray-200 bg-gray-50 hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-gray-900">
              Gestion d’activité
            </h3>
            <p className="mt-3 text-sm text-gray-600 leading-relaxed">
              Un tableau de bord moderne pour suivre vos annonces, vos ventes,
              vos missions, votre matériel et vos encaissements.
            </p>
          </div>

          {/* Support & Assistance */}
          <div className="p-6 rounded-lg border border-gray-200 bg-gray-50 hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-gray-900">
              Support & Assistance
            </h3>
            <p className="mt-3 text-sm text-gray-600 leading-relaxed">
              Une équipe disponible pour accompagner les pros du bâtiment et
              assurer un service fiable et de qualité.
            </p>
          </div>

        </section>

      </div>
    </main>
  );
}
