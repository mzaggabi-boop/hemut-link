// app/about/page.tsx

export const metadata = {
  title: "À propos — Hemut-link",
  description:
    "Découvrez Hemut-link, la plateforme dédiée aux professionnels du bâtiment : marketplace, missions express, conciergerie et services spécialisés.",
};

export default function AboutPage() {
  return (
    <main className="bg-white pt-20 pb-24">
      <div className="mx-auto max-w-5xl px-6">
        
        {/* HEADER */}
        <header className="text-center mb-16">
          <h1 className="text-3xl font-bold text-gray-900">
            À propos de Hemut-link
          </h1>
          <p className="mt-4 text-gray-600 text-sm max-w-2xl mx-auto">
            Hemut-link révolutionne le secteur du bâtiment grâce à une
            plateforme moderne, simple et intuitive regroupant outils,
            marketplace, missions express et services spécialisés.
          </p>
        </header>

        {/* SECTION 1 : L'IDÉE */}
        <section className="mb-20">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Une plateforme pensée pour les professionnels du bâtiment
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Hemut-link est née d’un constat simple : les professionnels du
            bâtiment manquent d’outils centralisés pour acheter, vendre,
            collaborer, dépanner, et gérer leurs activités efficacement.  
            Nous avons créé une plateforme qui réunit en un seul endroit :
          </p>

          <ul className="mt-6 space-y-3 text-sm text-gray-700 ml-4">
            <li>• Une marketplace dédiée au matériel du bâtiment</li>
            <li>• Des missions express avec Hemut-link Go</li>
            <li>• Un système de paiement sécurisé</li>
            <li>• Un tableau de bord moderne pour gérer son activité</li>
            <li>• Une future conciergerie spécialisée pour les pros</li>
          </ul>
        </section>

        {/* SECTION 2 : VALEURS */}
        <section className="mb-20">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Nos valeurs
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            
            <div className="p-6 rounded-lg border border-gray-200 bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-900">
                Simplicité
              </h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                Une interface fluide, rapide et intuitive pour faciliter la
                vie des artisans, fournisseurs et professionnels.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-gray-200 bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-900">
                Fiabilité
              </h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                Des outils robustes, un système sécurisé, et une plateforme
                pensée pour résister aux exigences du terrain.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-gray-200 bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-900">
                Communauté
              </h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                Connecter les professionnels entre eux pour créer une chaîne
                solidaire et efficace.
              </p>
            </div>

          </div>
        </section>

        {/* SECTION 3 : MISSION */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Notre mission
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Offrir aux professionnels du bâtiment un espace unique pour acheter,
            vendre, collaborer, se dépanner en urgence, gérer leur matériel et
            optimiser leur activité.  
            Hemut-link évolue constamment pour répondre aux besoins réels du
            terrain, avec une attention particulière portée à la qualité
            d'expérience et à la fiabilité technique.
          </p>
        </section>

      </div>
    </main>
  );
}
