// app/marketplace/my-sales/page.tsx
"use client";

import { useEffect, useState } from "react";
import Button from "../../../components/Button";


const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8081";

interface MarketItemSummary {
  id: number;
  title: string;
  price: number;
}

interface UserSummary {
  id: number;
  firstname: string | null;
  lastname: string | null;
  email: string;
}

interface Sale {
  id: number;
  amount: number;
  createdAt: string;
  item: MarketItemSummary;
  buyer: UserSummary;
}

export default function MySalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSales = async () => {
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("authToken")
          : null;

      if (!token) {
        // Pas de token → pas de ventes
        setSales([]);
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_URL}/marketplace/my-sales`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json().catch(() => ({}));
      setSales(data.sales || []);
    } catch (err) {
      console.error("Erreur chargement ventes:", err);
      setSales([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSales();
  }, []);

  if (loading) {
    return <div className="p-6 text-neutral-300">Chargement…</div>;
  }

  if (sales.length === 0) {
    return (
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-semibold text-amber-400">
          Mes ventes Marketplace
        </h1>
        <div className="text-neutral-400">Aucune vente enregistrée.</div>
      </div>
    );
  }

  const formatBuyerName = (buyer: UserSummary) => {
    const name =
      [buyer.firstname, buyer.lastname].filter(Boolean).join(" ") ||
      buyer.email;
    return name;
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-amber-400">
        Mes ventes Marketplace
      </h1>

      <div className="space-y-4">
        {sales.map((s) => (
          <div
            key={s.id}
            className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-2"
          >
            <h3 className="text-neutral-50 text-lg font-semibold">
              {s.item?.title ?? "Article"}
            </h3>

            <p className="text-neutral-400 text-sm">
              Acheté par : {formatBuyerName(s.buyer)}
            </p>

            <p className="text-neutral-400 text-sm">
              Montant : {s.amount.toFixed(2)} €
            </p>

            <p className="text-neutral-400 text-xs">
              Date : {new Date(s.createdAt).toLocaleString()}
            </p>

            <Button
              variant="secondary"
              className="w-full"
              onClick={() =>
                (window.location.href = `/marketplace/${s.item?.id}`)
              }
            >
              Voir l’article →
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
