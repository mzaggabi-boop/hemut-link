"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ReviewPage({ params }: { params: { id: string } }) {
  const jobId = Number(params.id);
  const router = useRouter();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendReview() {
    setLoading(true);

    const res = await fetch("/api/go/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jobId,
        rating,
        comment,
      }),
    });

    setLoading(false);

    if (!res.ok) {
      alert("Erreur lors de l’envoi de l’avis.");
      return;
    }

    router.push(`/dashboard/go/${jobId}`);
  }

  return (
    <main className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-xl font-semibold text-gray-900">
        Laisser un avis sur la mission #{jobId}
      </h1>

      {/* NOTE */}
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => setRating(n)}
            className={`text-3xl ${
              n <= rating ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            ★
          </button>
        ))}
      </div>

      {/* COMMENTAIRE */}
      <textarea
        className="w-full border rounded-lg p-3 text-sm"
        rows={5}
        placeholder="Votre retour sur l'intervention…"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <button
        disabled={loading}
        onClick={sendReview}
        className="px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-900 w-full"
      >
        {loading ? "Envoi…" : "Envoyer mon avis"}
      </button>
    </main>
  );
}
