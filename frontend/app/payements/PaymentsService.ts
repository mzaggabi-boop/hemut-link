export async function payMission(missionId: string): Promise<{ url?: string }> {
  const res = await fetch(`${API_URL}/payments/pay-mission`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ missionId }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error || "Impossible d'effectuer le paiement.");
  }

  return data;
}
