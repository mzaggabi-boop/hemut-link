// app/marketplace/my-listings/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../../../components/Button";


const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8081";

interface Listing {
  id: string;
  title: string;
  price: number;
  condition: string;
  location: string;
}

export default function MyListingsPage() {
  const router = useRouter();
  const [items, setItems] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  const loadItems = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.replace("/auth/login");
      return;
    }

    const res = await fetch(`${API_URL}/marketplace/my-listings`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json().catch(() => ({}));
    if (res.ok) setItems(data.listings || []);
    setLoading(false);
  };

  useEffect(() => {
    loadItems();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <Button variant="secondary" onClick={() => router.back()}>
        ← Retour
      </Button>

      <h1 className="text-2xl font-semibold text-amber-400">
        Mes annonces
      </h1>

      {loading ? (
        <div className="text-neutral-300">Chargement…</div>
      ) : items.length === 0 ? (
        <div className="text-neutral-400">Aucune annonce publiée.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-2"
            >
              <h3 className="text-neutral-50 font-semibold">{item.title}</h3>
              <p className="text-amber-400 font-bold">{item.price} €</p>
              <p className="text-neutral-400 text-sm">
                État : {item.condition}
              </p>
              <p className="text-neutral-400 text-sm">
                Localisation : {item.location}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
