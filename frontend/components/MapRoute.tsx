// frontend/components/MapRoute.tsx
"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";

interface MapRouteProps {
  start: [number, number];   // [lng, lat]
  end: [number, number];     // [lng, lat]
  route?: any;
}

export default function MapRoute({ start, end, route }: MapRouteProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: start,
      zoom: 11,
    });

    // Start marker (green)
    new mapboxgl.Marker({ color: "#22c55e" }).setLngLat(start).addTo(map);

    // End marker (red)
    new mapboxgl.Marker({ color: "#ef4444" }).setLngLat(end).addTo(map);

    if (route?.geometry) {
      map.on("load", () => {
        map.addSource("route", {
          type: "geojson",
          data: { type: "Feature", geometry: route.geometry }
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
  }, [start[0], start[1], end[0], end[1], route]);

  return (
    <div
      ref={mapContainer}
      className="w-full h-[350px] rounded-xl overflow-hidden border border-neutral-800"
    />
  );
}
