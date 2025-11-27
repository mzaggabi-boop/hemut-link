"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/Button";
import { buyMarketplaceItem } from "@/services/MarketplacePaymentService";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8081";

interface MarketItem {
  id: string;
  title: string;
  description: string;
  price: number;
  seller: {
    id: string;
    fullName: string;
  };
}

export default function MarketplaceItemPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [item, setItem] = useState<MarketItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadItem = async () => {
    try {
      const res = await fetch(`${API_URL}/marketplace/item/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setItem(data.item);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async () => {
    setBuying(true);
    try {
      const url = await buyMarketplaceItem(id);
      window.location.href = url;
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBuying(false);
    }
  };

  useEffect(() => {
    loadItem();
  }, []);

  if (loading) return <div className="p-6 text-neutral-300">Chargement…</div>;
  if (error || !item) return <div className="p-6 text-red-400">{error}</div>;

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <Button variant="secondary" onClick={() => router.back()}>
        ← Retour
      </Button>

      <h1 className="text-2xl font-semibold text-amber-400">{item.title}</h1>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-4">
        <p className="text-neutral-400 text-sm">
          Vendeur : {item.seller.fullName}
        </p>

        <p className="text-neutral-300 whitespace-pre-line">
          {item.description}
        </p>

        <p className="text-neutral-200 font-medium text-xl">
          Prix : {item.price} €
        </p>

        {error && (
          <div className="text-red-400 text-sm">{error}</div>
        )}

        <Button
          variant="primary"
          className="w-full mt-4"
          loading={buying}
          onClick={handleBuy}
        >
          Acheter maintenant 💳
        </Button>
      </div>
    </div>
  );
}


