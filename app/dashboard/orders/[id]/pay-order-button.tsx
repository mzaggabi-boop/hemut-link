// app/dashboard/orders/[id]/pay-order-button.tsx
"use client";

import { useState } from "react";

export default function PayOrderButton({ orderId }: { orderId: number }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePay() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/payments/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur lors de la création du paiement");
      }

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("URL de redirection Stripe manquante");
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handlePay}
        disabled={loading}
        className="px-4 py-2 rounded-lg bg-black text-white text-sm font-semibold hover:bg-gray-900 disabled:opacity-40"
      >
        {loading ? "Redirection vers Stripe…" : "Payer maintenant"}
      </button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
