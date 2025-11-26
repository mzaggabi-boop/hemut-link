"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Button from "../../components/Button";
import Map from "../../components/Map";
import DistanceBadge from "../../components/DistanceBadge";
import { getRouteInfo } from "../../services/MapboxRouteService";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8081";

type MissionStatus = "ACCEPTEE" | "EN_COURS" | "TERMINEE" | "PAID" | "ANNULEE" | string;

interface Mission {
  id: string;
  type: string;
  title: string;
  description: string;
  startAddress: string;
  endAddress: string;
  budget: number;
  createdAt: string;
  status: MissionStatus;

  startLat?: number;
  startLng?: number;
  endLat?: number;
  endLng?: number;
}

export default function MissionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [mission, setMission] = useState<Mission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accepting, setAccepting] = useState(false);
  const [routeInfo, setRouteInfo] = useState<{ distanceKm: number; durationMin: number } | null>(null);

  const loadMission = async () => {
    try {
      const res = await fetch(`${API_URL}/go/mission/${id}`);
      const data = await res.json().catch(() => ({}));

      if (!res.ok) throw new Error(data?.error || "Mission introuvable.");

      setMission(data.mission);

      if (
        data.mission?.startLat &&
        data.mission?.startLng &&
        data.mission?.endLat &&
        data.mission?.endLng
      ) {
        getRouteInfo(
          [data.mission.startLng, data.mission.startLat],
          [data.mission.endLng, data.mission.endLat]
        ).then((info) => {
          if (info) setRouteInfo(info);
        });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const acceptMission = async () => {
    setAccepting(true);
    setError(null);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        router.replace("/auth/login");
        return;
      }

      const res = await fetch(`${API_URL}/go/mission/${id}/accept`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Impossible d’accepter la mission.");

      router.push(`/go/${id}/accepted`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setAccepting(false);
    }
  };

  useEffect(() => {
    loadMission();
  }, []);

  if (loading) {
    return <div className="p-6 text-neutral-300">Chargement de la mission…</div>;
  }

  if (error || !mission) {
    return (
      <div className="p-6 text-red-400">
        Erreur : {error || "Impossible de charger la mission."}
      </div>
    );
  }

  const isPaid = mission.status === "PAID";

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <Button variant="secondary" onClick={() => router.back()}>
        ← Retour
      </Button>

      <h1 className="text-2xl font-semibold text-amber-400">
        {mission.title}
      </h1>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-4">
        <p className="text-neutral-400 text-sm">
          Type : <span className="text-amber-400 font-medium">{mission.type}</span>
        </p>

        <p className="text-neutral-400 text-sm">
          Statut :{" "}
          {isPaid ? (
            <span className="text-green-400">Payée ✅</span>
          ) : mission.status === "TERMINEE" ? (
            <span className="text-amber-400">Terminée – en attente de paiement</span>
          ) : mission.status === "EN_COURS" ? (
            <span className="text-amber-300">En cours</span>
          ) : mission.status === "ACCEPTEE" ? (
            <span className="text-neutral-200">Acceptée</span>
          ) : mission.status === "ANNULEE" ? (
            <span className="text-red-400">Annulée</span>
          ) : (
            <span className="text-neutral-400">{mission.status}</span>
          )}
        </p>

        <p className="text-neutral-300 whitespace-pre-line">
          {mission.description}
        </p>

        <div className="space-y-1">
          <p className="text-neutral-400 text-sm">
            Départ : {mission.startAddress}
          </p>
          <p className="text-neutral-400 text-sm">
            Arrivée : {mission.endAddress}
          </p>
        </div>

        <p className="text-neutral-200 font-medium text-xl">
          Budget : {mission.budget} €
        </p>

        {/* MAP */}
        <div className="mt-4">
          <Map
            latitude={mission.startLat ?? 48.8566}
            longitude={mission.startLng ?? 2.3522}
          />
        </div>

        {/* Distance / durée */}
        {routeInfo && (
          <DistanceBadge
            distanceKm={routeInfo.distanceKm}
            durationMin={routeInfo.durationMin}
          />
        )}

        {/* Paiement client (si mission terminée mais pas encore payée) */}
        {mission.status === "TERMINEE" && !isPaid && (
          <Button
            variant="primary"
            className="w-full mt-4"
            onClick={() => router.push(`/go/${id}/pay`)}
          >
            Payer maintenant 💳
          </Button>
        )}

        {/* Acceptation mission (logique artisan, on garde pour le futur) */}
        {mission.status !== "PAID" && mission.status !== "ANNULEE" && (
          <Button
            variant="secondary"
            loading={accepting}
            className="w-full mt-2"
            onClick={acceptMission}
          >
            Accepter la mission 🚀
          </Button>
        )}
      </div>
    </div>
  );
}
