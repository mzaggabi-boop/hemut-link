// frontend/app/services/MapboxRouteService.ts

/**
 * Récupère un itinéraire Mapbox (Driving) entre deux points.
 * Fonction serveur (aucun JSX, aucun hook React).
 */

export interface LatLng {
  lat: number;
  lng: number;
}

export async function getDrivingRoute(start: LatLng, end: LatLng) {
  const accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  if (!accessToken) {
    throw new Error("Missing Mapbox access token");
  }

  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start.lng},${start.lat};${end.lng},${end.lat}?geometries=geojson&overview=full&access_token=${accessToken}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Mapbox API error: ${response.status}`);
  }

  const data = await response.json();

  // Retourne la première route trouvée
  return data.routes?.[0] ?? null;
}
