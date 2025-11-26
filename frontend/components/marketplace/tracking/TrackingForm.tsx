"use client";

import { useState } from "react";

const carriers = ["Colissimo", "Chronopost", "DHL", "UPS", "Autre"];

export default function TrackingForm({ orderId }: { orderId: number }) {
  const [carrier, setCarrier] = useState("Colissimo");
  const [tracking, setTracking] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);

    const res = await fetch(`/api/marketplace/tracking/${orderId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        carrier,
        trackingNumber: tracking,
      }),
    });

    if (!res.ok) {
      alert("Erreur API");
      return;
    }

    window.location.reload();
  }

  return (
    <div className="space-y-3 border p-4 rounded-xl bg-white shadow-sm">
      <h3 className="text-sm font-semibold">Ajouter un suivi colis</h3>

      <select
        className="border rounded-lg px-3 py-2 text-sm w-full"
        value={carrier}
        onChange={(e) => setCarrier(e.target.value)}
      >
        {carriers.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Numéro de suivi"
        className="border rounded-lg px-3 py-2 text-sm w-full"
        value={tracking}
        onChange={(e) => setTracking(e.target.value)}
      />

      <button
        onClick={submit}
        disabled={loading}
        className="w-full bg-black text-white text-sm rounded-lg px-4 py-2 hover:bg-gray-900 disabled:opacity-40"
      >
        {loading ? "Envoi…" : "Enregistrer"}
      </button>
    </div>
  );
}
