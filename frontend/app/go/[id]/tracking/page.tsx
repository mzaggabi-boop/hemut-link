"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Button from "@/components/Button";
import MapRoute from "@/components/MapRoute";
import { getRouteInfo } from "@/services/MapboxRouteService";

export default function TrackingPage() {
  const { id } = useParams();

  const [route, setRoute] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    // ✔️ CORRECTION : getRouteInfo demande 2 arguments
    getRouteInfo(Number(id), "tracking")
      .then((result) => setRoute(result))
      .catch((err) => console.error("Mapbox error:", err));
  }, [id]);

  return (
    <div className="p-6 space-y-4">
      <Button variant="secondary" onClick={() => history.back()}>
        ← Retour
      </Button>

      <h1 className="text-xl font-semibold">Suivi du trajet</h1>

      {/* Display only when route OK */}
      {route ? (
        <MapRoute start={route.start} end={route.end} />
      ) : (
        <p className="text-gray-500 text-sm">Chargement du trajet…</p>
      )}
    </div>
  );
}
