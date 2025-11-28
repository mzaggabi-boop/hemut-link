"use client";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function Map({ lat, lon }: { lat: number; lon: number }) {
  return (
    <>
      {/* ⛔ Fix TypeScript: MapContainer types broken in react-leaflet 4.x */}
      {/* @ts-ignore */}
      <MapContainer
        center={[lat, lon]}
        zoom={15}
        scrollWheelZoom={false}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lon]} icon={icon} />
      </MapContainer>
    </>
  );
}
