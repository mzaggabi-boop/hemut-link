// app/dashboard/m10/search/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  async function handleSearch() {
    if (!query.trim()) return;
    setLoading(true);

    const res = await fetch("/api/m10/search?q=" + encodeURIComponent(query));
    const data = await res.json();

    setResults(data.results);
    setLoading(false);
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-6 space-y-6">
      {/* HEADER */}
      <header className="space-y-1 border-b border-gray-100 pb-4">
        <h1 className="text-xl font-semibold text-gray-900">
          Recherche avancée Marketplace (M10)
        </h1>
        <p className="text-xs text-gray-600">
          Recherche globale dans les produits Marketplace, commandes, missions
          GO et utilisateurs.
        </p>
      </header>

      {/* BARRE DE RECHERCHE */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Rechercher : produit, client, adresse, mission..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
        <button
          onClick={handleSearch}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Chercher
        </button>
      </div>

      {/* RESULTATS */}
      <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-4">
        <h2 className="text-sm font-semibold text-gray-900">Résultats</h2>

        {loading ? (
          <p className="text-xs text-gray-500">Recherche en cours...</p>
        ) : results.length === 0 ? (
          <p className="text-xs text-gray-500">Aucun résultat trouvé.</p>
        ) : (
          <ul className="divide-y divide-gray-100 text-xs">
            {results.map((item) => {
              const isOrder = item.type === "ORDER";
              const isProduct = item.type === "PRODUCT";
              const isGo = item.type === "GO";

              return (
                <li
                  key={`${item.type}-${item.id}`}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <div className="space-y-1">
                    <p className="font-medium text-gray-900">
                      {isProduct && `Produit : ${item.title}`}
                      {isOrder && `Commande #${item.id}`}
                      {isGo && `Mission GO #${item.id} — ${item.title}`}
                    </p>

                    <p className="text-[11px] text-gray-500">{item.subtitle}</p>
                  </div>

                  <Link
                    href={
                      isProduct
                        ? `/dashboard/marketplace/${item.id}`
                        : isOrder
                        ? `/dashboard/orders/${item.id}`
                        : `/dashboard/go/${item.id}`
                    }
                    className="text-[11px] font-medium text-indigo-600 hover:underline"
                  >
                    Ouvrir →
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
