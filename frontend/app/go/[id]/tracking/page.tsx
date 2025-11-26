// app/go/[id]/tracking/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/Button";
import MapRoute from "@/components/MapRoute";
import { getRouteInfo } from "@/services/MapboxRouteService"; // si tu l’utilises


const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8081";

interface Mission {
  id: string;
  title: string;
  type: string;
  startAddress: string;
  endAddress: string;
  budget: number;
  startLat?: number;
  startLng?: number;
  endLat?: number;
  endLng?: number;
}

export default function MissionTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [mission, setMission] = useState<Mission | null>(null);
  const [loading, setLoading] = useState(true);

  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);

  const [routeData, setRouteData] = useState<{ geometry: any } | null>(null);

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

    if (res.ok) {
      setMission(data.mission);

      if (
        data.mission.startLat &&
        data.mission.startLng &&
        data.mission.endLat &&
        data.mission.endLng
      ) {
        getRouteInfo(
          [data.mission.startLng, data.mission.startLat],
          [data.mission.endLng, data.mission.endLat]
        ).then((info) => {
          if (info?.geometry) setRouteData({ geometry: info.geometry });
        });
      }
    }

    setLoading(false);
  };

  const sendPositionToBackend = async (lat: number, lng: number) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      await fetch(`${API_URL}/go/mission/${id}/position`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ latitude: lat, longitude: lng }),
      });
    } catch {
      // silencieux
    }
  };

  const initGPS = () => {
    if (!navigator.geolocation) {
      setGpsError("GPS non disponible.");
      return;
    }

    navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setPosition({ lat, lng });
        sendPositionToBackend(lat, lng);
      },
      () => {
        setGpsError("Impossible d'obtenir ta position.");
      },
      { enableHighAccuracy: true, maximumAge: 1000, timeout: 5000 }
    );
  };

  useEffect(() => {
    loadMission();
    initGPS();
  }, []);

  if (loading || !mission) {
    return <div className="p-6 text-neutral-300">Chargement…</div>;
  }

  const canDisplayRoute =
    mission.startLat && mission.startLng && mission.endLat && mission.endLng;

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <Button variant="secondary" onClick={() => router.back()}>
        ← Retour
      </Button>

      <h1 className="text-2xl font-semibold text-amber-400">
        Suivi de la mission
      </h1>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-4">
        <p className="text-neutral-300">
          Mission :{" "}
          <span className="text-amber-400 font-semibold">{mission.title}</span>
        </p>

        <p className="text-neutral-400 text-sm">{mission.type}</p>

        <div className="space-y-1">
          <p className="text-neutral-400 text-sm">Départ : {mission.startAddress}</p>
          <p className="text-neutral-400 text-sm">Arrivée : {mission.endAddress}</p>
        </div>

        {canDisplayRoute && position && (
          <MapRoute
            start={{ lat: mission.startLat!, lng: mission.startLng! }}
            end={{ lat: mission.endLat!, lng: mission.endLng! }}
            route={routeData}
            userPosition={position}
          />
        )}

        {!position && (
          <div className="bg-neutral-800/40 rounded p-3 text-neutral-300 text-sm">
            {gpsError || "Initialisation GPS…"}
          </div>
        )}

        <Button
          variant="primary"
          className="w-full mt-4"
          onClick={() => router.push(`/go/${id}/completed`)}
        >
          Mission terminée ✔
        </Button>
      </div>
    </div>
  );
}


