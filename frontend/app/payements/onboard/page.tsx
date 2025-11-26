"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Button from "../../components/Button";

export default function StripeOnboardCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get("status") || "unknown";

  const isSuccess = status === "success";

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <Button variant="secondary" onClick={() => router.push("/dashboard")}>
        ← Retour au dashboard
      </Button>

      <h1 className="text-2xl font-semibold text-amber-400">
        Configuration Stripe
      </h1>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-3">
        {isSuccess ? (
          <>
            <p className="text-green-400 font-semibold">
              Ton compte Stripe est maintenant configuré ✅
            </p>
            <p className="text-neutral-300 text-sm">
              Tu peux maintenant recevoir des paiements sur Hemut-link Go.
            </p>
          </>
        ) : (
          <>
            <p className="text-red-400 font-semibold">
              La configuration Stripe n'a pas été finalisée ❌
            </p>
            <p className="text-neutral-300 text-sm">
              Tu peux relancer la procédure plus tard depuis la page Stripe Connect.
            </p>
          </>
        )}

        <Button
          variant="primary"
          className="w-full mt-2"
          onClick={() => router.push("/payments/connect")}
        >
          Revenir à Stripe Connect
        </Button>
      </div>
    </div>
  );
}
