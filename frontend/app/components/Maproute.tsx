"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";

interface MapRouteProps {
  start: { lat: number; lng: number };
  end: { lat: number; lng: number };
  route?: any; // GeoJSON optionnel du trajet
}

/**
 * Affiche une carte Mapbox avec un itinéraire entre deux points.
 */
export default function MapRoute({ start, end, route }: MapRouteProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [start.lng, start.lat],
      zoom: 11,
    });

    mapInstance.current = map;

    // Marqueurs
    new mapboxgl.Marker({ color: "#22c55e" })
      .setLngLat([start.lng, start.lat])
      .addTo(map);

    new mapboxgl.Marker({ color: "#fbbf24" })
      .setLngLat([end.lng, end.lat])
      .addTo(map);

    // Affichage de l'itinéraire si fourni
    if (route && route.geometry) {
      map.on("load", () => {
        if (!map.getSource("route")) {
          map.addSource("route", {
            type: "geojson",
            data: {
              type: "Feature",
              geometry: route.geometry,
              properties: {},
            },
          });

          map.addLayer({
            id: "route-line",
            type: "line",
            source: "route",
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "#facc15",
              "line-width": 4,
            },
          });

          // Fit bounds sur l'itinéraire
          const coords = route.geometry.coordinates;
          if (coords && coords.length > 1) {
            const bounds = coords.reduce(
              (b: mapboxgl.LngLatBoundsLike, c: [number, number]) =>
                (b as mapboxgl.LngLatBounds).extend(c),
              new mapboxgl.LngLatBounds(coords[0], coords[0])
            );
            map.fitBounds(bounds as any, { padding: 40 });
          }
        }
      });
    }

    return () => {
      map.remove();
    };
  }, [start.lat, start.lng, end.lat, end.lng, route]);

  return (
    <div
      ref={mapContainer}
      className="w-full h-[350px] rounded-xl overflow-hidden border border-neutral-800"
    />
  );
}