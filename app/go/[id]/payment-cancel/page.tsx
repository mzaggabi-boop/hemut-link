"use client";

import { useRouter } from "next/navigation";
import Button from "../../../../components/Button";

export default function PaymentCancelPage() {
  const router = useRouter();

  return (
    <div className="p-6 space-y-6 max-w-xl">
      <h1 className="text-2xl font-semibold text-red-400">
        Paiement annulé ❌
      </h1>

      <p className="text-neutral-300">
        Le paiement n'a pas été finalisé.<br />
        Vous pouvez réessayer le paiement ou revenir à la mission.
      </p>

      <div className="bg-neutral-900 border border-red-500/40 rounded-xl p-4 mt-4">
        <p className="text-neutral-400 text-sm">
          Aucune somme n’a été prélevée.  
          Vous pouvez recommencer la procédure en toute sécurité.
        </p>
      </div>

      <Button
        variant="primary"
        className="w-full"
        onClick={() => router.push(`/go/${router.params?.id}/pay`)}
      >
        Réessayer le paiement →
      </Button>

      <Button
        variant="secondary"
        className="w-full"
        onClick={() => router.push(`/go/${router.params?.id}`)}
      >
        Retour à la mission →
      </Button>
    </div>
  );
}
