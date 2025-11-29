"use client";

import { Elements, type StripeElementsOptions } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

export default function StripeProvider({
  children,
  clientSecret,
}: {
  children: React.ReactNode;
  clientSecret: string;
}) {
  // Typage correct pour Stripe v3
  const options: StripeElementsOptions = {
    mode: "payment",
    amount: undefined,
    currency: undefined,
    clientSecret,
    appearance: {
      theme: "stripe",
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
}
