// app/go/[id]/accept-button.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AcceptButton({ jobId }: { jobId: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAccept() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/go/${jobId}/accept`, {
        method: "POST",
      });

      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.error || "Erreur lors de l’acceptation.");
      }

      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleAccept}
        disabled={loading}
        className="px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-900 disabled:opacity-50"
      >
        {loading ? "Traitement..." : "Accepter la mission"}
      </button>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
