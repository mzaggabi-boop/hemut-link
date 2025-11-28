"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function Map({ lat, lon }: { lat: number; lon: number }) {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Création de la map
    const map = L.map(mapRef.current).setView([lat, lon], 15);

    // Tiles
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap",
    }).addTo(map);

    // Marqueur
    L.marker([lat, lon], { icon }).addTo(map);

    // Cleanup
    return () => {
      map.remove();
    };
  }, [lat, lon]);

  return (
    <div
      ref={mapRef}
      style={{ width: "100%", height: "100%", borderRadius: "8px" }}
    />
  );
}
