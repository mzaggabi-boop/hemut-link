"use client";

import { useEffect, useState } from "react";

export default function TestApiPage() {
  const API_URL = "https://hemut-link-backend.onrender.com";
  const [health, setHealth] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkHealth() {
      try {
        const res = await fetch(`${API_URL}/health`);
        if (!res.ok) {
          throw new Error("Erreur API");
        }
        const data = await res.json();
        setHealth(data);
      } catch (err: any) {
        setError(err.message);
      }
    }

    checkHealth();
  }, []);

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-6">Hemut-link – Test API</h1>

      <p className="mb-2">
        <strong>URL backend :</strong> {API_URL}
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Réponse /health :</h2>

      {error && <p className="text-red-500">❌ Erreur : {error}</p>}

      {health ? (
        <pre className="p-4 bg-zinc-900 text-white rounded">
          {JSON.stringify(health, null, 2)}
        </pre>
      ) : (
        !error && <p>⏳ En attente de la réponse...</p>
      )}
    </main>
  );
}
