"use client";

import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutForm({ jobId }: { jobId: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePay(e: any) {
    e.preventDefault();

    if (!stripe || !elements) return;
    setLoading(true);
    setError(null);

    const res = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/go/${jobId}/pay/success`,
      },
      redirect: "if_required",
    });

    if (res.error) {
      setError(res.error.message || "Erreur de paiement.");
      setLoading(false);
      return;
    }
  }

  return (
    <form onSubmit={handlePay} className="space-y-6">
      <PaymentElement />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        disabled={loading}
        className="w-full bg-black text-white py-3 rounded-lg mt-4 disabled:opacity-50"
      >
        {loading ? "Traitement..." : "Payer"}
      </button>
    </form>
  );
}
