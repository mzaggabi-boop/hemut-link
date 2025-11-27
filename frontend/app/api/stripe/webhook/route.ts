// app/api/stripe/webhook/route.ts

import Stripe from "stripe";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✔ Obligatoire pour Stripe en App Router
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const preferredRegion = "iad1";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Signature manquante" },
      { status: 400 }
    );
  }

  const rawBody = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("❌ Webhook signature error:", err.message);
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      const orderId = Number(session.metadata?.orderId);
      if (!orderId) break;

      await prisma.marketplaceOrder.update({
        where: { id: orderId },
        data: {
          status: "paid",
          stripePaymentStatus: "succeeded",
        },
      });

      await prisma.stripeEvent.create({
        data: {
          eventId: event.id,
          type: event.type,
          payload: event as any,
        },
      });

      break;
    }

    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session;

      const orderId = Number(session.metadata?.orderId);
      if (!orderId) break;

      await prisma.marketplaceOrder.update({
        where: { id: orderId },
        data: {
          status: "canceled",
          stripePaymentStatus: "expired",
        },
      });

      break;
    }

    default:
      // autres events ignorés
      break;
  }

  return NextResponse.json({ received: true });
}

