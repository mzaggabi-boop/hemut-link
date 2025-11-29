"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Button from "@/components/Button";
import MapRoute from "@/components/MapRoute";
import { getRouteInfo, LatLng } from "@/services/MapboxRouteService";

export default function TrackingPage() {
  const { id } = useParams();

  const [route, setRoute] = useState<any>(null);

  // Positions de départ / arrivée de la mission GO
  const [start, setStart] = useState<LatLng | null>(null);
  const [end, setEnd] = useState<LatLng | null>(null);

  useEffect(() => {
    if (!id) return;

    // 1. Charger les infos de la mission GO
    async function loadJob() {
      const res = await fetch(`/api/go/${id}`);
      const data = await res.json();

      if (!res.ok) {
        console.error("Erreur chargement mission :", data);
        return;
      }

      const startPos: LatLng = {
        lat: data.startLat,
        lng: data.startLng,
      };

      const endPos: LatLng = {
        lat: data.endLat,
        lng: data.endLng,
      };

      setStart(startPos);
      setEnd(endPos);

      // 2. Charger l’itinéraire Mapbox
      getRouteInfo(startPos, endPos)
        .then((r) => setRoute(r))
        .catch((err) => console.error("Mapbox error:", err));
    }

    loadJob();
  }, [id]);

  return (
    <div className="p-6 space-y-4">
      <Button variant="secondary" onClick={() => history.back()}>
        ← Retour
      </Button>

      <h1 className="text-xl font-semibold">Suivi du trajet</h1>

      {start && end ? (
        <MapRoute start={start} end={end} route={route} />
      ) : (
        <p className="text-sm text-gray-500">Chargement du parcours…</p>
      )}
    </div>
  );
}
