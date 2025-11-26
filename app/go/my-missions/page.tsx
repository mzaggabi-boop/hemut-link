"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../../components/Button";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8081";

type MissionStatus = "ACCEPTEE" | "EN_COURS" | "TERMINEE" | "PAID" | "ANNULEE";

interface Mission {
  id: string;
  title: string;
  type: string;
  startAddress: string;
  endAddress: string;
  budget: number;
  status: MissionStatus;
}

export default function MyMissionsPage() {
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

      const res = await fetch(`${API_URL}/go/my-missions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

  const renderStatus = (status: MissionStatus) => {
    if (status === "PAID") return <span className="text-green-400">Payée</span>;
    if (status === "TERMINEE") return <span className="text-amber-400">Terminée</span>;
    if (status === "EN_COURS") return <span className="text-amber-300">En cours</span>;
    if (status === "ACCEPTEE") return <span className="text-neutral-200">Acceptée</span>;
    if (status === "ANNULEE") return <span className="text-red-400">Annulée</span>;
    return <span className="text-neutral-400">{status}</span>;
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-amber-400">Mes missions</h1>

      {error && (
        <div className="rounded-md border border-red-500/40 bg-red-950/40 px-3 py-2 text-sm text-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-neutral-300">Chargement…</div>
      ) : missions.length === 0 ? (
        <div className="text-neutral-400">Aucune mission pour le moment.</div>
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

              <p className="text-sm">
                Statut : {renderStatus(mission.status)}
              </p>

              {mission.status !== "PAID" && mission.status !== "ANNULEE" && (
                <Button
                  variant="primary"
                  className="w-full mt-2"
                  onClick={() =>
                    router.push(
                      mission.status === "EN_COURS"
                        ? `/go/${mission.id}/tracking`
                        : `/go/${mission.id}`
                    )
                  }
                >
                  Continuer →
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
