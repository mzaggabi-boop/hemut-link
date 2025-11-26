"use client";

import { useState } from "react";

export default function InvoiceButton({ orderId }: { orderId: number }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDownload() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/orders/${orderId}/invoice`);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Erreur lors de la génération de la facture.");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `facture-${orderId}.pdf`;
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={handleDownload}
        disabled={loading}
        className="px-4 py-2 rounded-lg border border-gray-300 text-xs font-semibold hover:bg-gray-50 disabled:opacity-40"
      >
        {loading ? "Génération de la facture..." : "Télécharger la facture PDF"}
      </button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
