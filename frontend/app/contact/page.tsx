// app/contact/page.tsx

export const metadata = {
  title: "Contact — Hemut-link",
  description:
    "Contactez l’équipe Hemut-link : assistance, informations, partenariat ou support professionnel.",
};

export default function ContactPage() {
  return (
    <main className="bg-white pt-20 pb-24">
      <div className="mx-auto max-w-5xl px-6">
        
        {/* HEADER */}
        <header className="text-center mb-16">
          <h1 className="text-3xl font-bold text-gray-900">
            Contactez-nous
          </h1>
          <p className="mt-4 text-gray-600 text-sm max-w-2xl mx-auto">
            Une question, un besoin d’assistance ou une demande de partenariat ?
            L’équipe Hemut-link est à votre écoute et vous répond rapidement.
          </p>
        </header>

        {/* GRID FORM & INFO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* FORMULAIRE */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Envoyer un message
            </h2>

            <form className="space-y-4">

              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">
                  Votre nom
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Nom complet"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">
                  Votre email
                </label>
                <input
                  type="email"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  placeholder="email@exemple.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">
                  Message
                </label>
                <textarea
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm min-h-[120px]"
                  placeholder="Comment pouvons-nous vous aider ?"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition w-full"
              >
                Envoyer
              </button>
            </form>
          </section>

          {/* INFO CONTACT */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Informations
            </h2>

            <div className="space-y-6 text-sm text-gray-700">

              <p>
                <span className="font-medium">Email :</span> <br />
                <a
                  href="mailto:contact@hemut-link.com"
                  className="text-indigo-600 hover:underline"
                >
                  contact@hemut-link.com
                </a>
              </p>

              <p>
                <span className="font-medium">Téléphone :</span> <br />
                <a
                  href="tel:+33600000000"
                  className="text-indigo-600 hover:underline"
                >
                  +33 6 00 00 00 00
                </a>
              </p>

              <p>
                <span className="font-medium">Support technique :</span> <br />
                Assistance dédiée pour les professionnels du bâtiment.
              </p>

              <p>
                <span className="font-medium">Partenariats :</span> <br />
                Vous êtes fournisseur, distributeur ou entreprise ?  
                Contactez-nous pour collaborer.
              </p>

            </div>
          </section>

        </div>

      </div>
    </main>
  );
}
