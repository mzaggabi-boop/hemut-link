// app/cgu/page.tsx

export const metadata = {
  title: "CGU / CGV — Hemut-link",
  description:
    "Conditions générales d'utilisation et de vente du service Hemut-link, plateforme dédiée aux professionnels du bâtiment.",
};

export default function CGUPage() {
  return (
    <main className="bg-white pt-20 pb-24">
      <div className="mx-auto max-w-5xl px-6">

        {/* TITRE */}
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Conditions Générales d’Utilisation (CGU)
        </h1>

        <div className="space-y-12 text-sm text-gray-700 leading-relaxed">

          {/* 1 — Objet */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              1. Objet
            </h2>
            <p>
              Les présentes Conditions Générales d’Utilisation (ci-après « CGU »)
              régissent l’utilisation de la plateforme <strong>Hemut-link</strong>,
              accessible depuis le site officiel.  
              En utilisant la plateforme, l’utilisateur accepte pleinement et sans réserve
              les présentes CGU.
            </p>
          </section>

          {/* 2 — Services */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              2. Services proposés
            </h2>
            <ul className="list-disc ml-5 mt-2 space-y-2">
              <li>Accès à une marketplace dédiée aux professionnels du bâtiment</li>
              <li>Publication et gestion d’annonces de matériel</li>
              <li>Service de missions express via Hemut-link Go</li>
              <li>Système de paiement sécurisé via Stripe Connect</li>
              <li>Espace professionnel (dashboard)</li>
              <li>Services de conciergerie (à venir)</li>
            </ul>
          </section>

          {/* 3 — Accès */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              3. Accès au service
            </h2>
            <p>
              La création d’un compte professionnel est obligatoire pour accéder aux
              fonctionnalités avancées, telles que la publication d’annonces,
              les missions express ou les paiements sécurisés.
            </p>
          </section>

          {/* 4 — Comptes utilisateur */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              4. Comptes utilisateur
            </h2>
            <p>
              L’utilisateur s’engage à fournir des informations exactes et à jour lors
              de la création de son compte.  
              Toute tentative de fraude, d’usurpation ou de création de multiples comptes
              pourra entraîner la suspension immédiate.
            </p>
          </section>

          {/* 5 — Responsabilités */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              5. Responsabilités
            </h2>
            <p>
              Hemut-link n’est pas responsable :
            </p>
            <ul className="list-disc ml-5 mt-2 space-y-2">
              <li>Des contenus publiés par les utilisateurs</li>
              <li>Des transactions réalisées entre professionnels</li>
              <li>Des retards ou annulations dans les missions express</li>
              <li>Des pannes liées au matériel vendu ou loué</li>
            </ul>
          </section>

          {/* 6 — Paiements */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              6. Paiements et sécurisation
            </h2>
            <p>
              Les paiements sont gérés via <strong>Stripe Connect</strong>, garantissant
              un niveau élevé de sécurité et de conformité.  
              Hemut-link ne stocke aucune information bancaire.
            </p>
          </section>

          {/* 7 — Marketplace */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              7. Utilisation de la marketplace
            </h2>
            <p>
              Chaque utilisateur est responsable de ses annonces, de leur conformité
              et de la véracité des informations fournies.
            </p>
          </section>

          {/* 8 — Missions express */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              8. Hemut-link Go (missions express)
            </h2>
            <p>
              Les missions express relèvent d’un accord direct entre les professionnels.
              Hemut-link agit comme intermédiaire technique et ne peut être tenue
              responsable des actions indépendantes des utilisateurs.
            </p>
          </section>

          {/* 9 — Propriété intellectuelle */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              9. Propriété intellectuelle
            </h2>
            <p>
              L’intégralité du site, de son design, de son code et de son contenu reste
              la propriété exclusive d’Hemut-link.
            </p>
          </section>

          {/* 10 — Modification */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              10. Modification des CGU
            </h2>
            <p>
              L’éditeur se réserve le droit de mettre à jour les présentes CGU à tout
              moment. L’utilisateur sera informé en cas de modification importante.
            </p>
          </section>

        </div>

      </div>
    </main>
  );
}
