const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8081";

export async function buyMarketplaceItem(itemId: string) {
  const res = await fetch(`${API_URL}/payments/checkout-item`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ itemId }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok || !data.checkoutUrl) {
    throw new Error(data.error || "Impossible de lancer le paiement.");
  }

  return data.checkoutUrl;
}
