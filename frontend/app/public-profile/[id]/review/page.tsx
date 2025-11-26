// app/public-profile/[id]/review/page.tsx

"use client";

import { useState } from "react";
import Stars from "@/components/Stars"; // ⬅ à adapter selon le vrai nom du fichier



export default function LeaveReviewPage({
  params,
}: {
  params: { id: string };
}) {
  const artisanId = Number(params.id);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setError(null);

    const res = await fetch("/api/reviews/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ artisanId, rating, comment }),
    });

    if (!res.ok) {
      const j = await res.json();
      setError(j.error || "Erreur.");
      return;
    }

    setSuccess(true);
  }

  return (
    <main className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-xl font-semibold text-gray-900">
        Laisser un avis
      </h1>

      {success ? (
        <p className="text-green-600 text-sm">
          ✔ Avis envoyé avec succès !
        </p>
      ) : (
        <>
          <div className="space-y-2">
            <label className="text-sm font-medium">Note</label>

            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  onClick={() => setRating(s)}
                  className={`p-1 rounded ${
                    rating === s ? "bg-yellow-300" : "bg-gray-100"
                  }`}
                >
                  <Stars value={s} size={20} />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Commentaire</label>
            <textarea
              className="w-full border rounded-lg p-2 text-sm"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            onClick={submit}
            className="w-full bg-black text-white py-2 rounded-lg text-sm font-semibold"
          >
            Envoyer
          </button>
        </>
      )}
    </main>
  );
}
