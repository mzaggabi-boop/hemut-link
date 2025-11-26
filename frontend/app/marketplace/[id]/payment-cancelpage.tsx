"use client";

import Button from "../../../../components/Button";
import { useRouter } from "next/navigation";

export default function MarketplacePaymentCancel() {
  const router = useRouter();

  return (
    <div className="p-6 space-y-6 max-w-xl">
      <h1 className="text-2xl font-semibold text-red-400">
        Paiement annulé ❌
      </h1>

      <p className="text-neutral-300">
        Aucun paiement n’a été effectué. Vous pouvez réessayer à tout moment.
      </p>

      <Button
        variant="secondary"
        className="w-full"
        onClick={() => router.back()}
      >
        Réessayer →
      </Button>
    </div>
  );
}
