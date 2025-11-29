// frontend/app/payements/PaymentsService.ts

// On récupère l'URL de l'API backend depuis les variables d'env
const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("❌ NEXT_PUBLIC_API_URL n'est pas défini dans l'environnement.");
}

export async function payMission(
  missionId: string
): Promise<{ url?: string }> {
  const res = await fetch(`${API_URL}/payments/pay-mission`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ missionId }),
  });

  let data: any = {};
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    throw new Error(data?.error || "Impossible d'effectuer le paiement.");
  }

  return data;
}
