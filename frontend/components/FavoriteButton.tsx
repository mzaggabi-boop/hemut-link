"use client";

import { useState, useEffect } from "react";

export default function FavoriteButton({
  productId,
  initialFavorite,
}: {
  productId: number;
  initialFavorite: boolean;
}) {
  const [favorite, setFavorite] = useState(initialFavorite);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch("/api/favorites/toggle", {
        method: "POST",
        body: JSON.stringify({ productId }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.ok) {
        setFavorite(data.favorite);
      } else {
        alert(data.error || "Erreur");
      }
    } catch (e) {
      alert("Erreur réseau");
    }

    setLoading(false);
  }

  return (
    <button
      onClick={toggle}
      className={`text-xl ${
        favorite ? "text-red-600" : "text-gray-400"
      } hover:scale-110 transition`}
      title="Ajouter aux favoris"
    >
      {favorite ? "❤️" : "🤍"}
    </button>
  );
}
