// frontend/lib/stripe.ts

export const runtime = "nodejs";

import Stripe from "stripe";

// Obligatoire : apiVersion explicite pour éviter l’erreur Vercel
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export default stripe;
