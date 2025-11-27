"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../../../components/Button";
import { createStripeConnectAccount } from "../../../services/PaymentsService";

export default function StripeConnectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await createStripeConnectAccount();

      if (data.onboardingUrl) {
        window.location.href = data.onboardingUrl;
      } else {
        throw new Error("Lien d'onboarding Stripe manquant.");
      }
    } catch (err: any) {
      setError(err.message || "Erreur Stripe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <Button variant="secondary" onClick={() => router.back()}>
        ← Retour
      </Button>

      <h1 className="text-2xl font-semibold text-amber-400">
        Connecter mon compte Stripe
      </h1>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-4">
        <p className="text-neutral-300 text-sm">
          Pour recevoir tes paiements Hemut-link Go, tu dois connecter un compte Stripe.
        </p>

        <p className="text-neutral-500 text-xs">
          Tu seras redirigé vers Stripe pour compléter les informations légales (IBAN, identité, etc.).
        </p>

        {error && (
          <div className="rounded-md border border-red-500/40 bg-red-950/40 px-3 py-2 text-sm text-red-200">
            {error}
          </div>
        )}

        <Button
          variant="primary"
          className="w-full mt-2"
          loading={loading}
          onClick={handleConnect}
        >
          Connecter mon compte Stripe
        </Button>
      </div>
    </div>
  );
}
