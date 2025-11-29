// app/api/marketplace/pay/checkout/route.ts



import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import stripe from "@/lib/stripe";
import { supabaseServer } from "@/lib/supabase-server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: "orderId manquant" },
        { status: 400 }
      );
    }

    const supabase = await supabaseServer();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user)
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    const buyer = await prisma.user.findUnique({
      where: { supabaseId: user.id },
    });

    if (!buyer)
      return NextResponse.json(
        { error: "Utilisateur introuvable" },
        { status: 404 }
      );

    const order = await prisma.marketplaceOrder.findUnique({
      where: { id: orderId },
      include: {
        product: true,
        seller: true,
      },
    });

    if (!order)
      return NextResponse.json(
        { error: "Commande introuvable" },
        { status: 404 }
      );

    if (order.buyerId !== buyer.id)
      return NextResponse.json(
        { error: "Vous n'êtes pas l'acheteur de cette commande" },
        { status: 403 }
      );

    if (order.status === "paid")
      return NextResponse.json(
        { error: "Commande déjà payée" },
        { status: 400 }
      );

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: buyer.email,
      line_items: [
        {
          price_data: {
            currency: order.currency,
            product_data: {
              name: order.product.title,
              description: "Achat marketplace Hemut-link",
            },
            unit_amount: order.total * 100,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/marketplace/order/success?orderId=${order.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/marketplace/order/cancel`,
      metadata: {
        orderId: order.id.toString(),
      },
    });

    await prisma.marketplaceOrder.update({
      where: { id: order.id },
      data: {
        stripeCheckoutSessionId: session.id,
        stripePaymentStatus: "requires_payment_method",
      },
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Erreur serveur lors de la création du paiement" },
      { status: 500 }
    );
  }
}
