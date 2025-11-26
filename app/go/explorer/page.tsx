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

export default function ExplorerMissionsPage() {
  const router = useRouter();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMissions = async () => {
    const res = await fetch(`${API_URL}/go/explorer`);
    const data = await res.json();
    setMissions(data.missions || []);
    setLoading(false);
  };

  useEffect(() => {
    loadMissions();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-amber-400">
        Explorer les missions
      </h1>

      {loading ? (
        <div className="text-neutral-300">Chargement…</div>
      ) : missions.length === 0 ? (
        <div className="text-neutral-400">Aucune mission disponible.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {missions.map((m) => (
            <div
              key={m.id}
              className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-3"
            >
              <h3 className="text-neutral-50 font-semibold">{m.title}</h3>
              <p className="text-neutral-400 text-sm">{m.type}</p>

              <p className="text-neutral-400 text-sm">
                Départ : {m.startAddress}
              </p>
              <p className="text-neutral-400 text-sm">
                Arrivée : {m.endAddress}
              </p>

              <p className="text-neutral-200 font-medium text-lg">
                Budget : {m.budget} €
              </p>

              <p className="text-sm">
                Statut :{" "}
                {m.status === "PAID" ? (
                  <span className="text-green-400">Payée</span>
                ) : m.status === "TERMINEE" ? (
                  <span className="text-amber-400">Terminée — en attente de paiement</span>
                ) : (
                  <span className="text-neutral-300">{m.status}</span>
                )}
              </p>

              {/* Bouton Payer si mission TERMINÉE mais NON PAYÉE */}
              {m.status === "TERMINEE" && (
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => router.push(`/go/${m.id}/pay`)}
                >
                  Payer maintenant 💳
                </Button>
              )}

              <Button
                variant="secondary"
                className="w-full"
                onClick={() => router.push(`/go/${m.id}`)}
              >
                Voir →
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

