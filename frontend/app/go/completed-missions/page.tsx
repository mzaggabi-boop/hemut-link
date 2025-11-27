"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../../../components/Button";



const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8081";

type MissionStatus = "TERMINEE" | "PAID" | string;

interface Mission {
  id: string;
  title: string;
  type: string;
  startAddress: string;
  endAddress: string;
  budget: number;
  completedAt: string;
  status: MissionStatus;
}

export default function CompletedMissionsPage() {
  const router = useRouter();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMissions = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        router.replace("/auth/login");
        return;
      }

      const res = await fetch(`${API_URL}/go/completed-missions`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok)
        throw new Error(data?.error || "Impossible de charger les missions.");

      setMissions(data.missions || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMissions();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-amber-400">
        Missions terminées ✔
      </h1>

      {error && (
        <div className="rounded-md border border-red-500/40 bg-red-950/40 px-3 py-2 text-red-200 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-neutral-300">Chargement…</div>
      ) : missions.length === 0 ? (
        <div className="text-neutral-400">Aucune mission terminée.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {missions.map((mission) => (
            <div
              key={mission.id}
              className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-2"
            >
              <h3 className="text-lg font-semibold text-neutral-50">
                {mission.title}
              </h3>

              <p className="text-neutral-400 text-sm">{mission.type}</p>

              <p className="text-neutral-400 text-sm">
                Départ : {mission.startAddress}
              </p>

              <p className="text-neutral-400 text-sm">
                Arrivée : {mission.endAddress}
              </p>

              <p className="text-neutral-200 font-medium">
                Budget : {mission.budget} €
              </p>

              <p className="text-green-400 text-sm">
                Terminé le : {new Date(mission.completedAt).toLocaleString()}
              </p>

              <p className="text-sm">
                Paiement :{" "}
                {mission.status === "PAID" ? (
                  <span className="text-green-400">Payée</span>
                ) : (
                  <span className="text-amber-400">En attente</span>
                )}
              </p>

              <Button
                variant="secondary"
                className="w-full mt-2"
                onClick={() => router.push(`/go/${mission.id}`)}
              >
                Voir la mission →
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
