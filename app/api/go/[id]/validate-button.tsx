"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ValidateButton({ jobId }: { jobId: number }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleValidate() {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/go/${jobId}/validate`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur lors de la validation.");
        setLoading(false);
        return;
      }

      router.refresh();
    } catch (err: any) {
      setError(err.message || "Erreur réseau.");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleValidate}
        disabled={loading}
        className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-40"
      >
        {loading ? "Validation..." : "Valider la mission"}
      </button>

      {error && <p className="text-[11px] text-red-600">{error}</p>}
    </div>
  );
}
