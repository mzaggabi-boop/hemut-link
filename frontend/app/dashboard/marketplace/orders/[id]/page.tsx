"use client";

import { useParams } from "next/navigation";

export default function OrderDetailsPage() {
  const { id } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-amber-400">
        Détails de la commande #{id}
      </h1>

      <p className="text-neutral-300 mt-4">
        Cette page affichera les informations détaillées de la commande.
      </p>
    </div>
  );
}
