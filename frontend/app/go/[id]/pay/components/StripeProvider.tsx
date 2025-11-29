"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

export default function StripeProvider({
  children,
  clientSecret,
}: {
  children: React.ReactNode;
  clientSecret: string;
}) {
  // ❗️ On ne tape PAS options → Stripe gère selon la version installée
  const options = {
    mode: "payment",
    clientSecret,
    appearance: {
      theme: "stripe",
    },
  } as any; // <-- FIX : éviter le conflit de type

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
}
