// frontend/components/MapRoute.tsx

"use client";

import { useEffect, useRef } from "react";

interface MapRouteProps {
  start?: [number, number]; // [lng, lat]
  end?: [number, number];   // [lng, lat]
}

export default function MapRoute({ start, end }: MapRouteProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Ici tu pourras mettre ta logique Mapbox si besoin.
    // Pour l’instant on affiche un bloc simple pour éviter les erreurs Vercel.

    console.log("MapRoute initialized with:", { start, end });
  }, [start, end]);

  return (
    <div
      ref={mapRef}
      className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg"
    >
      <span className="text-gray-600 text-sm">MapRoute placeholder</span>
    </div>
  );
}

