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

    getRouteInfo(Number(id))
      .then((result) => {
        if (!result) return;

        // result.start/end sont en LatLng → on convertit
        const startPoint: LatLng = result.start;
        const endPoint: LatLng = result.end;

        setStart([startPoint.lng, startPoint.lat]);
        setEnd([endPoint.lng, endPoint.lat]);
        setRoute(result.route);
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

