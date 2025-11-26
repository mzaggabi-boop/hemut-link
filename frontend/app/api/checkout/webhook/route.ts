import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

export const runtime = "nodejs"; // Stripe ne fonctionne pas en Edge
export const dynamic = "force-dynamic"; // Les webhooks doivent être dynamiques
export const preferredRegion = "fra1"; // recommandé sur Vercel
export const bodyParser = false; // Nouvelle méthode Next.js 15/16

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2023-10-16",
  });

  const rawBody = await req.arrayBuffer();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return new NextResponse("Missing signature", { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      Buffer.from(rawBody),
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("❌ constructEvent error :", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // 🔥 Traitement de l'événement Stripe
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    console.log("🔥 Session Stripe complétée :", session.id);

    await prisma.payment.create({
      data: {
        stripeSessionId: session.id,
        amount: session.amount_total ?? 0,
        userEmail: session.customer_details?.email ?? "",
      },
    });
  }

  return NextResponse.json({ received: true });
}
