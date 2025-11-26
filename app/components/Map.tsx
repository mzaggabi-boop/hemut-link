"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken =
  process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";

interface MapProps {
  latitude: number;
  longitude: number;
  zoom?: number;
}

export default function Map({ latitude, longitude, zoom = 12 }: MapProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    if (mapInstance.current) {
      mapInstance.current.setCenter([longitude, latitude]);
      return;
    }

    mapInstance.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [longitude, latitude],
      zoom,
    });

    new mapboxgl.Marker({ color: "#fbbf24" })
      .setLngLat([longitude, latitude])
      .addTo(mapInstance.current);

    return () => {
      mapInstance.current?.remove();
    };
  }, [latitude, longitude]);

  return (
    <div
      ref={mapContainer}
      className="w-full h-[350px] rounded-xl overflow-hidden border border-neutral-800"
    />
  );
}
