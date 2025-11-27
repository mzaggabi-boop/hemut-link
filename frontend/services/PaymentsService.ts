// frontend/services/PaymentsService.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8081";

export interface StripeConnectResponse {
  onboardingUrl: string;
  accountId?: string;
}

/**
 * Crée un compte Stripe Connect et renvoie l'URL d'onboarding.
 */
export async function createStripeConnectAccount(): Promise<StripeConnectResponse> {
  const res = await fetch(`${API_URL}/payments/create-account`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error || "Impossible de créer le compte Stripe.");
  }

  return data;
}

/**
 * Récupère un lien vers le dashboard Stripe Connect.
 */
export async function getStripeDashboardLink(): Promise<string> {
  const res = await fetch(`${API_URL}/payments/dashboard-link`, {
    credentials: "include",
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok || !data?.url) {
    throw new Error(data?.error || "Impossible de récupérer le dashboard Stripe.");
  }

  return data.url as string;
}
