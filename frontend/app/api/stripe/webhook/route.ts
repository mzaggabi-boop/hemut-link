// app/api/stripe/webhook/route.ts

import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ⚠️ Stripe Webhook doit absolument tourner côté Node (pas Edge)
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const preferredRegion = "iad1";

// ❗ apiVersion supprimé : indispensable sous Next.js 16
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      return NextResponse.json(
        { error: "Missing signature" },
        { status: 400 }
      );
    }

    // ✔ App Router → raw body en texte, pas arrayBuffer
    const rawBody = await req.text();

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err: any) {
      console.error("❌ Invalid webhook signature:", err.message);
      return NextResponse.json(
        { error: `Webhook error: ${err.message}` },
        { status: 400 }
      );
    }

    // 📌 Enregistrement interne de l’événement Stripe
    await prisma.stripeEvent.create({
      data: {
        eventId: event.id,
        type: event.type,
        payload: event.data.object as any,
      },
    });

    // ---------------------------------------------
    // 🎯 TRAITEMENT DES ÉVÉNEMENTS STRIPE
    // ---------------------------------------------

    if (event.type === "payment_intent.succeeded") {
      const intent = event.data.object as Stripe.PaymentIntent;

      const goJobId = intent.metadata?.goJobId;
      const paymentIntentId = intent.id;

      if (!goJobId) {
        console.warn("⚠️ Webhook: goJobId manquant");
        return NextResponse.json({ ok: true });
      }

      console.log("🎉 Paiement GO validé pour la mission", goJobId);

      // 🔄 Mettre à jour transaction
      await prisma.payment.updateMany({
        where: { stripePaymentIntentId: paymentIntentId },
        data: { status: "SUCCEEDED" },
      });

      // 🔄 Mettre la mission IN_PROGRESS
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

    return NextResponse.json({ received: true });

  } catch (err) {
    console.error("🔥 Webhook global error:", err);
    return NextResponse.json(
      { error: "Internal webhook error" },
      { status: 500 }
    );
  }
}
