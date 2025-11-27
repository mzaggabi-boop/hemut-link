// app/api/checkout/webhook/route.ts

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    // ❗ Stripe sans apiVersion (corrige l’erreur Vercel)
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    const rawBody = await req.arrayBuffer();
    const signature = req.headers.get("stripe-signature") as string;

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        Buffer.from(rawBody),
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err: any) {
      console.error("Webhook signature error:", err.message);
      return NextResponse.json(
        { error: `Signature invalid: ${err.message}` },
        { status: 400 }
      );
    }

    // 🎯 TRAITEMENT DES ÉVÉNEMENTS
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const orderId = Number(session.metadata?.orderId);
      if (!orderId) {
        console.error("Webhook: orderId manquant !");
        return NextResponse.json({ ok: true });
      }

      await prisma.marketplaceOrder.update({
        where: { id: orderId },
        data: { status: "paid" },
      });

      console.log("Commande payée :", orderId);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook global error:", err);
    return NextResponse.json(
      { error: "Erreur interne webhook." },
      { status: 500 }
    );
  }
}
