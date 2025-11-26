// app/mentions-legales/page.tsx

export const metadata = {
  title: "Mentions légales — Hemut-link",
  description:
    "Mentions légales du site Hemut-link. Informations relatives à l'éditeur, à l'hébergement et à la propriété intellectuelle.",
};

export default function MentionsLegalesPage() {
  return (
    <main className="bg-white pt-20 pb-24">
      <div className="mx-auto max-w-5xl px-6">

        {/* TITRE */}
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Mentions légales
        </h1>

        <div className="space-y-12 text-sm text-gray-700 leading-relaxed">

          {/* 1 — Éditeur */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              1. Éditeur du site
            </h2>
            <p>
              Le site <span className="font-medium">Hemut-link</span> est édité par :
              <br />
              <span className="font-medium">Hemut-link</span> — Plateforme dédiée aux professionnels du bâtiment.  
              <br />
              Adresse : (à compléter)  
              <br />
              Email : contact@hemut-link.com  
              <br />
              Téléphone : +33 6 00 00 00 00  
            </p>
          </section>

          {/* 2 — Hébergement */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              2. Hébergement
            </h2>
            <p>
              Le site est hébergé par :
              <br />
              <span className="font-medium">Vercel Inc.</span>  
              <br />
              440 N Barranca Ave #4133, Covina, CA 91723, États-Unis  
              <br />
              Site : https://vercel.com  
            </p>
          </section>

          {/* 3 — Propriété intellectuelle */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              3. Propriété intellectuelle
            </h2>
            <p>
              L'ensemble du contenu présent sur le site Hemut-link (textes, images,
              graphismes, logos, icônes, vidéos, structure, technologies) est protégé
              par les lois en vigueur sur la propriété intellectuelle.
            </p>
            <p className="mt-2">
              Toute reproduction ou représentation, totale ou partielle, est strictement
              interdite sans autorisation préalable.
            </p>
          </section>

          {/* 4 — Protection des données */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              4. Protection des données personnelles
            </h2>
            <p>
              Hemut-link respecte le RGPD et s’engage à assurer la confidentialité des
              données collectées.  
              Les informations recueillies sont utilisées uniquement dans le cadre des
              services proposés par la plateforme.
            </p>
            <p className="mt-2">
              Pour plus d’informations, consultez notre page{" "}
              <a href="/confidentialite" className="text-indigo-600 hover:underline">
                Politique de confidentialité
              </a>.
            </p>
          </section>

          {/* 5 — Responsabilité */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              5. Responsabilité
            </h2>
            <p>
              L’éditeur ne peut être tenu responsable en cas de dysfonctionnement
              technique ou d’erreurs indépendantes de sa volonté lors de
              l’utilisation du site.
            </p>
          </section>

        </div>

      </div>
    </main>
  );
}
