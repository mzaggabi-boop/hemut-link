// app/marketplace/my-purchases/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

interface Purchase {
  id: number;
  amount: number;
  createdAt: string;
  item: MarketItemSummary;
  seller: UserSummary;
}

export default function MyPurchasesPage() {
  const router = useRouter();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPurchases = async () => {
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("authToken")
          : null;

      if (!token) {
        router.replace("/auth/login");
        return;
      }

      const res = await fetch(`${API_URL}/marketplace/my-purchases`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json().catch(() => ({}));
      setPurchases(data.purchases || []);
    } catch (err) {
      console.error("Erreur chargement achats:", err);
      setPurchases([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPurchases();
  }, []);

  if (loading) {
    return <div className="p-6 text-neutral-300">Chargement…</div>;
  }

  if (purchases.length === 0) {
    return (
      <div className="p-6 space-y-4">
        <Button variant="secondary" onClick={() => router.back()}>
          ← Retour
        </Button>

        <h1 className="text-2xl font-semibold text-amber-400">
          Mes achats Marketplace
        </h1>

        <div className="text-neutral-400">Aucun achat enregistré.</div>
      </div>
    );
  }

  const formatSellerName = (seller: UserSummary) => {
    const name =
      [seller.firstname, seller.lastname].filter(Boolean).join(" ") ||
      seller.email;
    return name;
  };

  return (
    <div className="p-6 space-y-6">
      <Button variant="secondary" onClick={() => router.back()}>
        ← Retour
      </Button>

      <h1 className="text-2xl font-semibold text-amber-400">
        Mes achats Marketplace
      </h1>

      <div className="space-y-4">
        {purchases.map((p) => (
          <div
            key={p.id}
            className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-2"
          >
            <h3 className="text-neutral-50 text-lg font-semibold">
              {p.item?.title ?? "Article"}
            </h3>

            <p className="text-neutral-400 text-sm">
              Vendu par : {formatSellerName(p.seller)}
            </p>

            <p className="text-neutral-400 text-sm">
              Montant : {p.amount.toFixed(2)} €
            </p>

            <p className="text-neutral-400 text-xs">
              Date : {new Date(p.createdAt).toLocaleString()}
            </p>

            <Button
              variant="secondary"
              className="w-full"
              onClick={() =>
                router.push(`/marketplace/${p.item?.id}`)
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
