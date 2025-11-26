"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";

interface MapUserProps {
  latitude: number;
  longitude: number;
}

export default function MapUser({ latitude, longitude }: MapUserProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const markerInstance = useRef<mapboxgl.Marker | null>(null);

  // Initialisation
  useEffect(() => {
    if (!mapContainer.current) return;

    if (!mapInstance.current) {
      mapInstance.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [longitude, latitude],
        zoom: 14
      });

      markerInstance.current = new mapboxgl.Marker({ color: "#fbbf24" })
        .setLngLat([longitude, latitude])
        .addTo(mapInstance.current);
    }
  }, []);

  // Mise à jour de la position en live
  useEffect(() => {
    if (!mapInstance.current || !markerInstance.current) return;

    markerInstance.current.setLngLat([longitude, latitude]);
    mapInstance.current.setCenter([longitude, latitude]);
  }, [latitude, longitude]);

  return (
    <div
      ref={mapContainer}
      className="w-full h-[350px] rounded-xl overflow-hidden border border-neutral-800"
    />
  );
}
