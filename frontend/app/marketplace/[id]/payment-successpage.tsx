"use client";

import Button from "../../../../components/Button";
import { useRouter } from "next/navigation";

export default function MarketplacePaymentSuccess() {
  const router = useRouter();

  return (
    <div className="p-6 space-y-6 max-w-xl">
      <h1 className="text-2xl font-semibold text-green-400">
        Paiement réussi ✔
      </h1>

      <p className="text-neutral-300">
        L'article a bien été acheté. Le vendeur a été crédité automatiquement.
      </p>

      <Button
        variant="primary"
        className="w-full"
        onClick={() => router.push("/marketplace")}
      >
        Retour marketplace →
      </Button>
    </div>
  );
}
