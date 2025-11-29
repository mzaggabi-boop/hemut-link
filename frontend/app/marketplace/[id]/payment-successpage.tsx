// frontend/app/marketplace/[id]/payment-successpage.tsx
"use client";

import Button from "../../../components/Button"; // ✅ chemin corrigé
import { useRouter } from "next/navigation";

export default function MarketplacePaymentSuccess() {
  const router = useRouter();

  return (
    <div className="p-6 space-y-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold text-green-400">
        Paiement réussi ✔
      </h1>

      <p className="text-neutral-300 leading-relaxed">
        L’article a été acheté avec succès.
        <br />
        Le vendeur a été automatiquement crédité.  
        Vous pouvez maintenant retourner sur la marketplace ou continuer vos achats.
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
