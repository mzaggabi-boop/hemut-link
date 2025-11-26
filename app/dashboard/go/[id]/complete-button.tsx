// app/dashboard/go/[id]/complete-button.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CompleteButton({ jobId }: { jobId: number }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  async function handleComplete() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/dashboard/go/${jobId}/complete`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur lors de la finalisation.");
        setLoading(false);
        return;
      }

      // Succès → Rafraîchir la page pour afficher "COMPLETED"
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleComplete}
        disabled={loading}
        className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? "Finalisation…" : "Marquer comme terminé"}
      </button>

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
