"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Button from "../../../components/Button";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8081";

interface Mission {
  id: string;
  title: string;
  type: string;
  startAddress: string;
  endAddress: string;
  budget: number;
  status: string;
}

export default function PayMissionPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [mission, setMission] = useState<Mission | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMission = async () => {
    try {
      const res = await fetch(`${API_URL}/go/mission/${id}`, {
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Impossible de charger la mission.");

      setMission(data.mission);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const startPayment = async () => {
    setPaying(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/payments/checkout-mission`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ missionId: id }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.checkoutUrl) {
        throw new Error(data.error || "Erreur lors de la création du paiement.");
      }

      // Redirection Stripe Checkout
      window.location.href = data.checkoutUrl;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setPaying(false);
    }
  };

  useEffect(() => {
    loadMission();
  }, []);

  if (loading) return <div className="p-6 text-neutral-300">Chargement…</div>;

  if (error || !mission)
    return <div className="p-6 text-red-400">{error || "Mission introuvable"}</div>;

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <Button variant="secondary" onClick={() => router.back()}>
        ← Retour
      </Button>

      <h1 className="text-2xl font-semibold text-amber-400">
        Paiement de la mission
      </h1>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-4">
        <p className="text-neutral-300">
          Mission : <span className="text-amber-400">{mission.title}</span>
        </p>
        <p className="text-neutral-400 text-sm">{mission.type}</p>

        <p className="text-neutral-400 text-sm">
          Départ : {mission.startAddress}
        </p>

        <p className="text-neutral-400 text-sm">
          Arrivée : {mission.endAddress}
        </p>

        <p className="text-neutral-200 font-medium text-xl">
          Montant à régler : {mission.budget} €
        </p>

        {error && (
          <div className="text-sm text-red-400 bg-red-950/40 border border-red-500/40 p-3 rounded">
            {error}
          </div>
        )}

        <Button
          variant="primary"
          loading={paying}
          onClick={startPayment}
          className="w-full mt-2"
        >
          Procéder au paiement 💳
        </Button>
      </div>
    </div>
  );
}


