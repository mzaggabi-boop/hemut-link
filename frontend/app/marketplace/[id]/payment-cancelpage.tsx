// frontend/app/marketplace/[id]/payment-cancelpage.tsx
"use client";

import { useRouter, useParams } from "next/navigation";
import Button from "@/components/Button"; // ✅ Chemin absolu correct

export default function MarketplacePaymentCancel() {
  const router = useRouter();
  const params = useParams();

  const id = params?.id; // ✅ Récupération correcte du paramètre dynamique

  return (
    <div className="p-6 space-y-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold text-red-500">
        Paiement annulé ❌
      </h1>

      <p className="text-neutral-300">
        Le paiement n’a pas été finalisé.
        <br />
        Vous pouvez réessayer ou revenir au produit.
      </p>

      <div className="bg-neutral-900 border border-red-500/40 rounded-xl p-4 mt-4">
        <p className="text-neutral-400 text-sm">
          Aucune somme n’a été prélevée.<br />
          Vous pouvez recommencer la procédure en toute sécurité.
        </p>
      </div>

      <Button
        variant="primary"
        className="w-full"
        onClick={() => router.push(`/marketplace/${id}/pay`)} // ✅ FIX
      >
        Réessayer le paiement →
      </Button>

      <Button
        variant="secondary"
        className="w-full"
        onClick={() => router.push(`/marketplace/${id}`)} // ✅ FIX
      >
        Retour au produit →
      </Button>
    </div>
  );
}
