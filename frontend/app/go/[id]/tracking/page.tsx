"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Button from "@/components/Button";
import MapRoute from "@/components/MapRoute";
import { getRouteInfo, type LatLng } from "@/services/MapboxRouteService";

export default function TrackingPage() {
  const { id } = useParams();

  const [start, setStart] = useState<LatLng | null>(null);
  const [end, setEnd] = useState<LatLng | null>(null);
  const [route, setRoute] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    // Coordonnées temporaires
    const fakeStart: LatLng = { lat: 48.8566, lng: 2.3522 };
    const fakeEnd: LatLng = { lat: 48.8666, lng: 2.3350 };

    getRouteInfo(fakeStart, fakeEnd)
      .then((routeData) => {
        if (!routeData) {
          setError("Impossible de récupérer l'itinéraire.");
          return;
        }

        setStart(fakeStart);
        setEnd(fakeEnd);
        setRoute(routeData);
      })
      .catch((err) => {
        console.error("Mapbox error:", err);
        setError("Erreur lors du chargement du trajet.");
      });
  }, [id]);

  return (
    <div className="p-6 space-y-4">
      <Button variant="secondary" onClick={() => history.back()}>
        ← Retour
      </Button>

      <h1 className="text-xl font-semibold">Suivi du trajet</h1>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {start && end ? (
        <MapRoute
          start={{ lat: start.lat, lng: start.lng }}
          end={{ lat: end.lat, lng: end.lng }}
          route={route}
        />
      ) : (
        <p className="text-sm text-gray-500">Chargement du parcours…</p>
      )}
    </div>
  );
}

