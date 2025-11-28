// lib/stripe.ts

import Stripe from "stripe";

// ✔️ NE PAS définir apiVersion → Next.js 16 plante sinon
// Stripe utilise automatiquement la version de ton dashboard
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default stripe;
