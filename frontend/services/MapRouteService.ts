"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";

// Autoriser start/end au format tableau OU objet
type LL = { lat: number; lng: number } | [number, number];

function normalize(p: LL): { lat: number; lng: number } {
  if (Array.isArray(p)) {
    return { lng: p[0], lat: p[1] }; // Mapbox: [lng, lat]
  }
  return p;
}

interface MapRouteProps {
  start: LL;
  end: LL;
  route?: { geometry: any } | null;
  userPosition?: { lat: number; lng: number } | null;
}

export default function MapRoute({ start, end, route, userPosition }: MapRouteProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);

  // Normalisation des coordonnées
  const s = normalize(start);
  const e = normalize(end);

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [s.lng, s.lat],
      zoom: 11,
    });

    // Départ
    new mapboxgl.Marker({ color: "#22c55e" })
      .setLngLat([s.lng, s.lat])
      .addTo(map);

    // Arrivée
    new mapboxgl.Marker({ color: "#ef4444" })
      .setLngLat([e.lng, e.lat])
      .addTo(map);

    // Tracé itinéraire
    if (route?.geometry) {
      map.on("load", () => {
        map.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: route.geometry,
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

    return () => map.remove();
  }, [s.lat, s.lng, e.lat, e.lng, route]);

  // Position artisan en live
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
