// app/go/my-earnings/page.tsx
"use client";

import { useEffect, useState } from "react";
import Button from "../../components/Button";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8081";

interface Earning {
  missionId: string;
  title: string;
  amount: number;
  date: string;
}

interface EarningsSummary {
  total: number;
  month: number;
  count: number;
}

export default function MyEarningsPage() {
  const router = useRouter();
  const [summary, setSummary] = useState<EarningsSummary | null>(null);
  const [items, setItems] = useState<Earning[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEarnings = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.replace("/auth/login");
      return;
    }

    const res = await fetch(`${API_URL}/go/my-earnings`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setSummary(data.summary || null);
      setItems(data.items || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadEarnings();
  }, []);

  if (loading) {
    return <div className="p-6 text-neutral-300">Chargement…</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <Button variant="secondary" onClick={() => router.back()}>
        ← Retour
      </Button>

      <h1 className="text-2xl font-semibold text-amber-400">
        Mes revenus Hemut-link Go
      </h1>

      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
            <p className="text-neutral-400 text-sm">Total cumulé</p>
            <p className="text-amber-400 text-2xl font-bold">
              {summary.total} €
            </p>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
            <p className="text-neutral-400 text-sm">Ce mois-ci</p>
            <p className="text-amber-400 text-2xl font-bold">
              {summary.month} €
            </p>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
            <p className="text-neutral-400 text-sm">Missions payées</p>
            <p className="text-amber-400 text-2xl font-bold">
              {summary.count}
            </p>
          </div>
        </div>
      )}

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-3">
        <h2 className="text-neutral-100 font-semibold text-lg">
          Détail des missions payées
        </h2>

        {items.length === 0 ? (
          <p className="text-neutral-400 text-sm">
            Aucune mission payée pour le moment.
          </p>
        ) : (
          <div className="space-y-2">
            {items.map((e) => (
              <div
                key={e.missionId}
                className="flex items-center justify-between border-b border-neutral-800 pb-2"
              >
                <div>
                  <p className="text-neutral-100 text-sm">{e.title}</p>
                  <p className="text-neutral-500 text-xs">
                    {new Date(e.date).toLocaleString()}
                  </p>
                </div>
                <p className="text-amber-400 font-semibold">
                  + {e.amount} €
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
