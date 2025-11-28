// app/api/stripe/webhook/route.ts

import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Stripe Webhooks requires Node.js runtime
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const preferredRegion = "iad1";

// ❗ Pas de apiVersion → règle l’erreur Vercel
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get("stripe-signature");
    if (!signature) return new NextResponse("Missing signature", { status: 400 });

    // App Router → raw body en texte
    const rawBody = await req.text();

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err: any) {
      console.error("Webhook signature error:", err.message);
      return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }

    // Enregistrer event Stripe
    await prisma.stripeEvent.create({
      data: {
        eventId: event.id,
        type: event.type,
        payload: event.data.object as any,
      },
    });

    // --- TRAITEMENT DES EVENTS ---

    if (event.type === "payment_intent.succeeded") {
      const intent = event.data.object as Stripe.PaymentIntent;

      const goJobId = intent.metadata?.goJobId;
      const paymentIntentId = intent.id;

      if (!goJobId) {
        console.warn("⚠️ goJobId manquant");
        return new NextResponse("OK", { status: 200 });
      }

      console.log("🎉 Paiement réussi GO :", goJobId);

      await prisma.payment.updateMany({
        where: { stripePaymentIntentId: paymentIntentId },
        data: { status: "SUCCEEDED" },
      });

      await prisma.goJob.update({
        where: { id: Number(goJobId) },
        data: { status: "IN_PROGRESS" },
      });
    }

    if (event.type === "payment_intent.payment_failed") {
      const intent = event.data.object as Stripe.PaymentIntent;

      await prisma.payment.updateMany({
        where: { stripePaymentIntentId: intent.id },
        data: { status: "FAILED" },
      });
    }

    return new NextResponse("OK", { status: 200 });

  } catch (err) {
    console.error("Webhook Error:", err);
    return new NextResponse("Internal error webhook", { status: 500 });
  }
}
