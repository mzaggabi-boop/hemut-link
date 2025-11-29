// lib/stripe.ts

export const runtime = "nodejs";

import Stripe from "stripe";

// Stripe demande une apiVersion explicite avec Next.js 16
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover" as Stripe.LatestApiVersion,
});

export default stripe;
