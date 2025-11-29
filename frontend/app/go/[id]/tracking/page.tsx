// frontend/app/go/[id]/tracking/page.tsx
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

    // ⚠️ Points temporaires (tu remplaceras par les vrais)
    const startPoint: LatLng = { lat: 48.8566, lng: 2.3522 }; // Paris
    const endPoint: LatLng = { lat: 48.8666, lng: 2.335 };   // Paris 2

    getRouteInfo(startPoint, endPoint)
      .then((result) => {
        if (!result || !result.route) {
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

  return (
    <div className="p-6 space-y-4">
      <Button variant="secondary" onClick={() => history.back()}>
        ← Retour
      </Button>

      <h1 className="text-xl font-semibold">Suivi du trajet</h1>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {start && end ? (
        <MapRoute
          start={[start.lng, start.lat]}   // ✅ FIX FORMAT
          end={[end.lng, end.lat]}         // ✅ FIX FORMAT
          route={route}
        />
      ) : (
        <p className="text-sm text-gray-500">Chargement du parcours…</p>
      )}
    </div>
  );
}


