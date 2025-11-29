"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Button from "@/components/Button";
import { getRouteInfo, type LatLng } from "@/services/MapboxRouteService";

// Dynamic import to avoid SSR issues with Leaflet/Mapbox
const MapRoute = dynamic(() => import("@/components/MapRoute"), {
  ssr: false,
  loading: () => <p className="text-sm text-gray-500">Chargement de la carte…</p>,
});

export default function TrackingPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [start, setStart] = useState<LatLng | null>(null);
  const [end, setEnd] = useState<LatLng | null>(null);
  const [route, setRoute] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    // Coordonnées temporaires
    const fakeStart: LatLng = { lat: 48.8566, lng: 2.3522 };
    const fakeEnd: LatLng = { lat: 48.8666, lng: 2.3350 };

    getRouteInfo(fakeStart, fakeEnd)
      .then((routeData) => {
        if (!routeData) {
          setError("Impossible de récupérer l'itinéraire.");
          setIsLoading(false);
          return;
        }

        setStart(fakeStart);
        setEnd(fakeEnd);
        setRoute(routeData);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Mapbox error:", err);
        setError("Erreur lors du chargement du trajet.");
        setIsLoading(false);
      });
  }, [id]);

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen p-6 space-y-4">
      <Button variant="secondary" onClick={handleBack}>
        ← Retour
      </Button>

      <h1 className="text-xl font-semibold">Suivi du trajet</h1>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-sm text-gray-500">Chargement du parcours…</p>
        </div>
      ) : start && end ? (
        <div className="w-full h-[500px] rounded-lg overflow-hidden border border-gray-200">
          <MapRoute
            start={{ lat: start.lat, lng: start.lng }}
            end={{ lat: end.lat, lng: end.lng }}
            route={route}
          />
        </div>
      ) : (
        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">Aucun trajet disponible</p>
        </div>
      )}
    </div>
  );
}

