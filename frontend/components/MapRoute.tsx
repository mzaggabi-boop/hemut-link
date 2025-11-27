"use client";

import { useEffect, useRef } from "react";

interface MapRouteProps {
  start?: [number, number];
  end?: [number, number];
}

export default function MapRoute({ start, end }: MapRouteProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Placeholder MapBox or Map logic
    console.log("Rendering MapRoute", { start, end });
  }, [start, end]);

  return (
    <div
      ref={ref}
      className="w-full h-64 bg-neutral-800 rounded-lg flex items-center justify-center text-neutral-400"
    >
      Carte en cours…
    </div>
  );
}
