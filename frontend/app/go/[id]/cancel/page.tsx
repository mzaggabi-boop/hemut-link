"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Button from "../../../../components/Button";


const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8081";

interface Mission {
  id: string;
  title: string;
  type: string;
  startAddress: string;
  endAddress: string;
  budget: number;
}

export default function CancelMissionPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [mission, setMission] = useState<Mission | null>(null);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMission = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.replace("/auth/login");
      return;
    }

    const res = await fetch(`${API_URL}/go/mission/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(data?.error || "Impossible de charger la mission.");
      return;
    }

    setMission(data.mission);
    setLoading(false);
  };

  const cancelMission = async () => {
    setCanceling(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        router.replace("/auth/login");
        return;
      }

      const res = await fetch(`${API_URL}/go/mission/${id}/cancel`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) throw new Error(data?.error || "Impossible d’annuler.");

      router.push(`/go`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCanceling(false);
    }
  };

  useEffect(() => {
    loadMission();
  }, []);

  if (loading) {
    return <div className="p-6 text-neutral-300">Chargement…</div>;
  }

  if (!mission) {
    return (
      <div className="p-6 text-red-400">La mission est introuvable.</div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <Button variant="secondary" onClick={() => router.back()}>
        ← Retour
      </Button>

      <h1 className="text-2xl font-semibold text-amber-400">
        Annuler la mission
      </h1>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-4">
        <p className="text-neutral-300">
          Tu es sur le point d’annuler la mission :
          <span className="text-amber-400 font-semibold"> {mission.title}</span>
        </p>

        <p className="text-neutral-400 text-sm">
          Type : {mission.type}
        </p>

        <p className="text-neutral-400 text-sm">
          Départ : {mission.startAddress}
        </p>

        <p className="text-neutral-400 text-sm">
          Arrivée : {mission.endAddress}
        </p>

        <p className="text-neutral-400 text-sm">
          Budget : {mission.budget} €
        </p>

        {error && (
          <div className="rounded border border-red-500/40 bg-red-950/40 px-3 py-2 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="bg-neutral-800/40 rounded p-4 text-neutral-300 text-sm">
          ⚠️ Cette action est définitive.  
          Dans une version future, l’annulation pourra nécessiter une raison.
        </div>

        <Button
          variant="primary"
          className="w-full mt-4"
          loading={canceling}
          onClick={cancelMission}
        >
          Annuler la mission
        </Button>
      </div>
    </div>
  );
}
