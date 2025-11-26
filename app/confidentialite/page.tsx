// app/confidentialite/page.tsx

export const metadata = {
  title: "Politique de confidentialité — Hemut-link",
  description:
    "Politique de confidentialité et gestion des données personnelles conforme au RGPD pour la plateforme Hemut-link.",
};

export default function ConfidentialitePage() {
  return (
    <main className="bg-white pt-20 pb-24">
      <div className="mx-auto max-w-5xl px-6">

        {/* TITRE */}
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Politique de confidentialité
        </h1>

        <div className="space-y-12 text-sm text-gray-700 leading-relaxed">

          {/* 1 — Introduction */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              1. Introduction
            </h2>
            <p>
              La présente politique de confidentialité explique comment
              <strong> Hemut-link </strong> collecte, utilise, stocke et protège
              vos données personnelles, conformément au RGPD.
            </p>
          </section>

          {/* 2 — Données collectées */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              2. Données collectées
            </h2>
            <p>Nous collectons différentes informations selon votre utilisation :</p>

            <ul className="list-disc ml-5 mt-2 space-y-2">
              <li>Données d’identification (nom, prénom, email…)</li>
              <li>Données professionnelles (activité, entreprise)</li>
              <li>Données de paiement (via Stripe — non stockées)</li>
              <li>Données de connexion (logs, adresses IP partielles)</li>
              <li>Données liées aux annonces et missions publiées</li>
            </ul>
          </section>

          {/* 3 — Finalités */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              3. Finalités du traitement
            </h2>
            <p>Vos données sont utilisées pour les finalités suivantes :</p>

            <ul className="list-disc ml-5 mt-2 space-y-2">
              <li>Accès à la marketplace et au dashboard</li>
              <li>Gestion des missions express Hemut-link Go</li>
              <li>Transactions sécurisées via Stripe</li>
              <li>Amélioration de la plateforme et de la sécurité</li>
              <li>Prévention de la fraude et identification des utilisateurs</li>
            </ul>
          </section>

          {/* 4 — Paiements */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              4. Paiements et sécurité
            </h2>
            <p>
              Les paiements sont gérés par <strong>Stripe Connect</strong>.  
              Hemut-link n’a aucun accès à vos numéros de carte bancaire.  
              Les transferts financiers et vérifications d’identité sont traités
              directement par Stripe.
            </p>
          </section>

          {/* 5 — Partage des données */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              5. Partage des données
            </h2>
            <p>Nous ne partageons vos données qu’avec :</p>

            <ul className="list-disc ml-5 mt-2 space-y-2">
              <li>Stripe (paiement et vérification d’identité)</li>
              <li>Services techniques (hébergement, emailing…)</li>
              <li>Autorités si la loi l’exige</li>
            </ul>
          </section>

          {/* 6 — Durée de conservation */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              6. Durée de conservation
            </h2>
            <p>
              Vos données sont conservées uniquement le temps nécessaire à la
              réalisation des services et aux obligations légales (paiements,
              facturation, sécurité).
            </p>
          </section>

          {/* 7 — Vos droits */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              7. Vos droits
            </h2>
            <p>Conformément au RGPD, vous disposez des droits suivants :</p>

            <ul className="list-disc ml-5 mt-2 space-y-2">
              <li>Droit d’accès à vos données</li>
              <li>Droit de rectification</li>
              <li>Droit à l’effacement</li>
              <li>Droit d’opposition</li>
              <li>Droit à la portabilité</li>
            </ul>

            <p className="mt-4">
              Pour exercer vos droits, contactez-nous à :  
              <a
                href="mailto:contact@hemut-link.com"
                className="text-indigo-600 hover:underline"
              >
                contact@hemut-link.com
              </a>
            </p>
          </section>

          {/* 8 — Sécurité */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              8. Sécurité de vos données
            </h2>
            <p>
              Nous mettons en place des mesures techniques et organisationnelles
              pour protéger vos données : chiffrement, sécurisation des accès,
              surveillance des systèmes, et conformité RGPD.
            </p>
          </section>

          {/* 9 — Modification */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              9. Modifications
            </h2>
            <p>
              Cette politique peut être mise à jour afin de refléter les
              évolutions de la plateforme ou des obligations légales.
              Toute modification importante sera notifiée aux utilisateurs.
            </p>
          </section>

        </div>

      </div>
    </main>
  );
}
