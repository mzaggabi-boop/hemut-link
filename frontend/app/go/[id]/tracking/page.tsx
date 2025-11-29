"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Button from "@/components/Button";
import MapRoute from "@/components/MapRoute";
import { getRouteInfo } from "@/services/MapboxRouteService";

import type { LatLng } from "@/services/MapboxRouteService";

export default function TrackingPage() {
  const { id } = useParams();

  const [start, setStart] = useState<[number, number] | null>(null);
  const [end, setEnd] = useState<[number, number] | null>(null);
  const [route, setRoute] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    // Comme getRouteInfo demande 2 LatLng on mock une position temporaire
    // → Ce sera remplacé plus tard par les vraies coordonnées en DB
    const dummyStart: LatLng = { lat: 48.8566, lng: 2.3522 }; // Paris
    const dummyEnd: LatLng = { lat: 48.8606, lng: 2.3376 }; // Louvre

    getRouteInfo(dummyStart, dummyEnd)
      .then((result) => {
        if (!result) return;

        const startPoint = dummyStart;
        const endPoint = dummyEnd;

        setStart([startPoint.lng, startPoint.lat]);
        setEnd([endPoint.lng, endPoint.lat]);
        setRoute(result);
      })
      .catch((err) => console.error("Mapbox error:", err));
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

