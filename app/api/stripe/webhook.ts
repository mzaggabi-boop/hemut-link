// app/api/stripe/webhook/route.ts
// (⚠️ déplace ce fichier dans /webhook/route.ts si ce n'est pas déjà fait)

import Stripe from "stripe";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✔ Obligatoire pour Stripe + App Router
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const preferredRegion = "iad1";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return new NextResponse("Missing signature", { status: 400 });
  }

  // ✔ App Router → raw body direct
  const rawBody = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("❌ ERROR verify webhook:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Enregistrer l’événement Stripe
  await prisma.stripeEvent.create({
    data: {
      eventId: event.id,
      type: event.type,
      payload: event.data.object as any,
    },
  });

  // TRAITEMENT DES EVENTS
  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object as Stripe.PaymentIntent;

    const goJobId = intent.metadata?.goJobId;
    const paymentIntentId = intent.id;

    if (!goJobId) {
      console.warn("⚠️ Aucun goJobId dans metadata");
      return new NextResponse("OK", { status: 200 });
    }

    console.log("🎉 Paiement GO réussi pour mission :", goJobId);

    // 1) Mettre à jour la transaction
    await prisma.payment.updateMany({
      where: { stripePaymentIntentId: paymentIntentId },
      data: { status: "SUCCEEDED" },
    });

    // 2) Mettre la mission en "IN_PROGRESS"
    await prisma.goJob.update({
      where: { id: parseInt(goJobId) },
      data: { status: "IN_PROGRESS" },
    });
  }

  if (event.type === "payment_intent.payment_failed") {
    const intent = event.data.object as Stripe.PaymentIntent;
    const paymentIntentId = intent.id;

    await prisma.payment.updateMany({
      where: { stripePaymentIntentId: paymentIntentId },
      data: { status: "FAILED" },
    });
  }

  return new NextResponse("OK", { status: 200 });
}
