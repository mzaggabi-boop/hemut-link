// frontend/components/MapRoute.tsx
"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";

interface MapRouteProps {
  start: { lat: number; lng: number };
  end: { lat: number; lng: number };
  route?: { geometry: any } | null;
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

    // Départ (vert)
    new mapboxgl.Marker({ color: "#22c55e" })
      .setLngLat([start.lng, start.lat])
      .addTo(map);

    // Arrivée (rouge)
    new mapboxgl.Marker({ color: "#ef4444" })
      .setLngLat([end.lng, end.lat])
      .addTo(map);

    if (route?.geometry) {
      map.on("load", () => {
        map.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},          // ✅ FIX : obligatoire
            geometry: route.geometry // geometry valide
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
      });
    }

    mapInstance.current = map;

    return () => {
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
