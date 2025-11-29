export interface LatLng {
  lat: number;
  lng: number;
}

export async function getDrivingRoute(start: LatLng, end: LatLng) {
  const accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  if (!accessToken) {
    throw new Error("NEXT_PUBLIC_MAPBOX_TOKEN manquant.");
  }

  const coords = `${start.lng},${start.lat};${end.lng},${end.lat}`;
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coords}?geometries=geojson&overview=full&access_token=${accessToken}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Mapbox API error: ${response.status}`);
  }

  const data = await response.json();

  return data.routes?.[0] ?? null;
}

export async function getRouteInfo(start: LatLng, end: LatLng) {
  return getDrivingRoute(start, end);
}
