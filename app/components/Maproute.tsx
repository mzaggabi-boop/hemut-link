"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";

interface MapRouteProps {
  start: { lat: number; lng: number };
  end: { lat: number; lng: number };
  route?: any; // GeoJSON du trajet (optionnel)
}

export default function MapRoute({ start, end, route }: MapRouteProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [start.lng, start.lat],
      zoom: 11,
    });

    // Marker Départ
    new mapboxgl.Marker({ color: "#22c55e" }) // vert
      .setLngLat([start.lng, start.lat])
      .addTo(map);

    // Marker Arrivée
    new mapboxgl.Marker({ color: "#ef4444" }) // rouge
      .setLngLat([end.lng, end.lat])
      .addTo(map);

    // Ligne du trajet
    if (route) {
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
            "line-color": "#fbbf24", // OR Hemut-link
          },
        });
      });
    }

    mapInstance.current = map;

    return () => {
      map.remove();
    };
  }, [start, end, route]);

  return (
    <div
      ref={mapContainer}
      className="w-full h-[350px] rounded-xl overflow-hidden border border-neutral-800"
    />
  );
}
