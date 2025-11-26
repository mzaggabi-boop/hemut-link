"use client";

import { useRouter } from "next/navigation";
import Button from "../../../../components/Button";

export default function PaymentSuccessPage() {
  const router = useRouter();

  return (
    <div className="p-6 space-y-6 max-w-xl">
      <h1 className="text-2xl font-semibold text-green-400">
        Paiement réussi ✔
      </h1>

      <p className="text-neutral-300">
        Merci pour votre paiement.<br />
        La mission est maintenant en cours de traitement et sera automatiquement
        marquée comme <span className="text-green-400">payée</span> dès
        confirmation Stripe.
      </p>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 mt-4">
        <p className="text-neutral-400 text-sm">
          Cette page est générée après validation Stripe.  
          Vous pouvez retourner aux missions ou vérifier vos paiements.
        </p>
      </div>

      <Button
        variant="primary"
        className="w-full"
        onClick={() => router.push("/go")}
      >
        Retour aux missions →
      </Button>

      <Button
        variant="secondary"
        className="w-full"
        onClick={() => router.push("/go/my-earnings")}
      >
        Voir mes revenus →
      </Button>
    </div>
  );
}
