// frontend/components/MapRoute.tsx
"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";

// Types stricts pour Mapbox
interface MapRouteProps {
  start: { lat: number; lng: number };
  end: { lat: number; lng: number };
  route?: {
    geometry: GeoJSON.LineString;  // ✅ format strict
  } | null;
  userPosition?: { lat: number; lng: number } | null;
}

export default function MapRoute({ start, end, route, userPosition }: MapRouteProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [start.lng, start.lat],
      zoom: 11,
    });

    // --- Markers départ et arrivée ---
    new mapboxgl.Marker({ color: "#22c55e" })
      .setLngLat([start.lng, start.lat])
      .addTo(map);

    new mapboxgl.Marker({ color: "#ef4444" })
      .setLngLat([end.lng, end.lat])
      .addTo(map);

    // --- Ajout de l’itinéraire ---
    map.on("load", () => {
      if (route?.geometry) {
        // Clean source si elle existe déjà
        if (map.getSource("route")) {
          map.removeLayer("route-line");
          map.removeSource("route");
        }

        map.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: route.geometry,
            properties: {}, // obligatoire
          },
        });

        map.addLayer({
          id: "route-line",
          type: "line",
          source: "route",
          paint: {
            "line-width": 4,
            "line-color": "#fbbf24",
          },
        });
      }
    });

    mapInstance.current = map;

    return () => {
      // --- Nettoyage complet ---
      if (map.getLayer("route-line")) map.removeLayer("route-line");
      if (map.getSource("route")) map.removeSource("route");
      map.remove();
    };
  }, [start.lat, start.lng, end.lat, end.lng, route]);

  // Marker artisan en live
  useEffect(() => {
    if (!mapInstance.current || !userPosition) return;

    if (!userMarkerRef.current) {
      userMarkerRef.current = new mapboxgl.Marker({ color: "#3b82f6" }).addTo(
        mapInstance.current
      );
    }

    userMarkerRef.current.setLngLat([userPosition.lng, userPosition.lat]);
  }, [userPosition]);

  return (
    <div
      ref={mapContainer}
      className="w-full h-[350px] rounded-xl overflow-hidden border border-neutral-800"
    />
  );
}

