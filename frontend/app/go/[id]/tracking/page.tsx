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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    getRouteInfo(Number(id))
      .then((result) => {
        if (!result) {
          setError("Impossible de récupérer l'itinéraire.");
          return;
        }

        setStart(result.start);
        setEnd(result.end);
        setRoute(result.route);
      })
      .catch((err) => {
        console.error("Mapbox error:", err);
        setError("Erreur lors du chargement du trajet.");
      });
  }, [id]);

  // Mapbox requiert des tableaux [lng, lat]
  const startArray = start ? ([start.lng, start.lat] as [number, number]) : null;
  const endArray = end ? ([end.lng, end.lat] as [number, number]) : null;

  return (
    <div className="p-6 space-y-4">
      <Button variant="secondary" onClick={() => history.back()}>
        ← Retour
      </Button>

      <h1 className="text-xl font-semibold">Suivi du trajet</h1>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {startArray && endArray ? (
        <MapRoute start={startArray} end={endArray} route={route} />
      ) : (
        <p className="text-sm text-gray-500">Chargement du parcours…</p>
      )}
    </div>
  );
}

