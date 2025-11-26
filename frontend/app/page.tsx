import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-neutral-950 to-neutral-900 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-24 px-4 pb-16 pt-20 md:px-8 lg:pt-24">
        {/* HERO */}
        <section className="grid gap-12 md:grid-cols-[3fr,2fr] items-center">
          <div className="space-y-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-300">
              Hemut-link • Plateforme PRO du bâtiment
            </span>
            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              La plateforme{" "}
              <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400 bg-clip-text text-transparent">
                tout-en-un
              </span>{" "}
              pour les artisans, fournisseurs et gestionnaires d&apos;immeubles.
            </h1>
            <p className="max-w-xl text-base text-neutral-300 sm:text-lg">
              Trouve des missions urgentes, gère ton matériel, sécurise tes paiements
              et collabore avec les meilleurs pros près de chez toi. Une expérience
              digne des grandes plateformes, pensée pour le bâtiment.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-black shadow-lg shadow-amber-500/30 transition hover:bg-amber-300 hover:shadow-amber-400/40"
              >
                Créer mon compte pro
              </Link>
              <Link
                href="/demo"
                className="inline-flex items-center justify-center rounded-full border border-neutral-700 px-6 py-3 text-sm font-semibold text-neutral-100 transition hover:border-neutral-500 hover:bg-neutral-900/60"
              >
                Voir la démo
              </Link>
              <p className="text-xs text-neutral-400">
                Sans engagement • 100% en ligne • Paiements sécurisés
              </p>
            </div>

            <div className="flex flex-wrap gap-6 text-xs text-neutral-400">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-white">+8 500</span>
                <span>Interventions terminées</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-white">24h/24</span>
                <span>Missions express Hemut-link Go</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-white">Stripe Connect</span>
                <span>Paiements sécurisés & portefeuilles</span>
              </div>
            </div>
          </div>

          {/* Preview Card */}
          <div className="relative">
            <div className="absolute -inset-6 rounded-3xl bg-gradient-to-tr from-amber-500/10 via-amber-400/5 to-cyan-400/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-950/80 shadow-2xl shadow-black/70">
              <div className="flex items-center justify-between border-b border-neutral-800 px-5 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="text-xs font-medium text-neutral-200">
                    Missions en cours
                  </span>
                </div>
                <span className="rounded-full bg-neutral-900 px-3 py-1 text-[10px] text-neutral-400">
                  Vue dispatch
                </span>
              </div>
              <div className="space-y-4 px-5 py-4">
                <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-neutral-900 to-neutral-900/40 px-4 py-3">
                  <div>
                    <p className="text-xs text-neutral-400">Mission express • Hemut-link Go</p>
                    <p className="text-sm font-semibold text-white">
                      Fuite d&apos;eau • Appartement Airbnb
                    </p>
                    <p className="text-xs text-neutral-400">12 min • 4,2 km • Paris 11e</p>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-300">
                    À affecter
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="rounded-xl border border-neutral-800 bg-neutral-900/70 px-3 py-2">
                    <p className="text-[11px] text-neutral-400">Artisans actifs</p>
                    <p className="text-sm font-semibold text-white">37</p>
                  </div>
                  <div className="rounded-xl border border-neutral-800 bg-neutral-900/70 px-3 py-2">
                    <p className="text-[11px] text-neutral-400">Commandes du jour</p>
                    <p className="text-sm font-semibold text-white">128</p>
                  </div>
                  <div className="rounded-xl border border-neutral-800 bg-neutral-900/70 px-3 py-2">
                    <p className="text-[11px] text-neutral-400">Satisfaction</p>
                    <p className="text-sm font-semibold text-emerald-400">4,9 / 5</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-dashed border-amber-400/40 bg-amber-500/5 px-4 py-3 text-xs text-amber-100">
                  Hemut-link centralise missions, matériel, paiements et notifications
                  en un seul outil pensé pour le terrain.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="space-y-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Une plateforme conçue pour le bâtiment, pas pour le web.
              </h2>
              <p className="max-w-2xl text-sm text-neutral-300">
                Hemut-link simplifie la vie des artisans, des gestionnaires d&apos;immeubles
                et des conciergeries. Du lead au paiement, tout est fluide et traçable.
              </p>
            </div>
            <div className="flex gap-2 text-xs text-neutral-400">
              <span className="rounded-full bg-neutral-900 px-3 py-1">
                Express • Hemut-link Go
              </span>
              <span className="rounded-full bg-neutral-900 px-3 py-1">
                Marketplace Matériel
              </span>
              <span className="rounded-full bg-neutral-900 px-3 py-1">
                Paiements & facturation
              </span>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex flex-col gap-3 rounded-2xl border border-neutral-800 bg-neutral-950/70 p-4">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/15 text-amber-300">
                ⚡
              </div>
              <h3 className="text-sm font-semibold">Missions express géolocalisées</h3>
              <p className="text-xs text-neutral-300">
                Interventions urgentes dispatchées en temps réel aux artisans disponibles
                à proximité. Acceptation en un clic, suivi en direct.
              </p>
              <p className="text-xs font-medium text-amber-300">
                Module Hemut-link Go inclus.
              </p>
            </div>

            <div className="flex flex-col gap-3 rounded-2xl border border-neutral-800 bg-neutral-950/70 p-4">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-cyan-500/15 text-cyan-300">
                🧰
              </div>
              <h3 className="text-sm font-semibold">Marketplace matériel & fournitures</h3>
              <p className="text-xs text-neutral-300">
                Vends, achète ou mutualise du matériel entre pros. Optimise ton stock,
                réduis tes coûts, évite les immobilisations inutiles.
              </p>
              <p className="text-xs font-medium text-cyan-300">
                Support multi-fournisseurs & conciergeries.
              </p>
            </div>

            <div className="flex flex-col gap-3 rounded-2xl border border-neutral-800 bg-neutral-950/70 p-4">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
                💳
              </div>
              <h3 className="text-sm font-semibold">Paiements sécurisés & portefeuille pro</h3>
              <p className="text-xs text-neutral-300">
                Stripe Connect, portefeuilles sécurisés, flux de paiement multi-acteurs,
                facturation automatisée et historique des transactions.
              </p>
              <p className="text-xs font-medium text-emerald-300">
                Compatible missions ponctuelles & contrats récurrents.
              </p>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Comment Hemut-link s&apos;intègre dans ton quotidien ?
            </h2>
            <p className="max-w-2xl text-sm text-neutral-300">
              Une expérience inspirée des meilleures apps B2C, adaptée aux réalités
              du terrain : marges, délais, SAV, coordination multi-intervenants.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex flex-col gap-2 rounded-2xl border border-neutral-800 bg-neutral-950/80 p-4">
              <p className="text-xs font-medium text-amber-300">1. Demande & qualification</p>
              <p className="text-xs text-neutral-300">
                Le gestionnaire ou la conciergerie crée une mission avec toutes les
                infos utiles : lieu, urgence, type d&apos;intervention, budget.
              </p>
            </div>
            <div className="flex flex-col gap-2 rounded-2xl border border-neutral-800 bg-neutral-950/80 p-4">
              <p className="text-xs font-medium text-cyan-300">2. Attribution & exécution</p>
              <p className="text-xs text-neutral-300">
                Hemut-link distribue la mission aux bons artisans (dispo, zone, compétences).
                Tu acceptes, tu interviens, tu remontes l&apos;info en direct.
              </p>
            </div>
            <div className="flex flex-col gap-2 rounded-2xl border border-neutral-800 bg-neutral-950/80 p-4">
              <p className="text-xs font-medium text-emerald-300">3. Clôture & paiement</p>
              <p className="text-xs text-neutral-300">
                Rapport, photos, validation, facture et paiement : tout est centralisé,
                traçable, et consultable dans ton dashboard.
              </p>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-500/15 via-amber-400/10 to-orange-500/15 px-6 py-8 sm:px-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold sm:text-2xl">
                Prêt à offrir une expérience premium à tes clients ?
              </h2>
              <p className="max-w-xl text-sm text-amber-100">
                Mets en place Hemut-link dans ta structure (artisans, facility management,
                conciergerie, réseau de partenaires) et pilote tout depuis une seule
                interface.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:items-end">
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center rounded-full bg-black px-6 py-3 text-sm font-semibold text-amber-300 shadow-lg shadow-black/50 ring-1 ring-amber-500/40 transition hover:bg-neutral-900 hover:text-amber-200"
              >
                Démarrer avec Hemut-link
              </Link>
              <span className="text-xs text-amber-100/90">
                Onboarding accompagné possible pour équipes +10 utilisateurs.
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}