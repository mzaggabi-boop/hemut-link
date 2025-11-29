"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Button from "@/components/Button";
import MapRoute from "@/components/MapRoute";
import { getRouteInfo } from "@/services/MapboxRouteService";
import type { LatLng } from "@/services/MapboxRouteService";

export default function TrackingPage() {
  const { id } = useParams();

  const [start, setStart] = useState<LatLng | null>(null);
  const [end, setEnd] = useState<LatLng | null>(null);
  const [route, setRoute] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    getRouteInfo(Number(id))
      .then((result) => {
        if (!result) return;

        setStart(result.start);
        setEnd(result.end);
        setRoute(result.route);
      })
      .catch((err) => console.error("Mapbox error:", err));
  }, [id]);

  // Convert {lat, lng} to [lat, lng] tuple (latitude first, longitude second)
  const startArray =
    start ? ([start.lat, start.lng] as [number, number]) : null;
  const endArray =
    end ? ([end.lat, end.lng] as [number, number]) : null;

  return (
    <div className="p-6 space-y-4">
      <Button variant="secondary" onClick={() => history.back()}>
        ← Retour
      </Button>

      <h1 className="text-xl font-semibold">Suivi du trajet</h1>

      {startArray && endArray ? (
        <MapRoute start={startArray} end={endArray} route={route} />
      ) : (
        <p className="text-sm text-gray-500">Chargement du parcours…</p>
      )}
    </div>
  );
}