// app/api/checkout/session/route.ts

import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";
import { notifyMarketplaceOrderCreated } from "@/lib/notifications";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productId, buyerId } = body;

    if (!productId || !buyerId) {
      return NextResponse.json(
        { error: "Informations manquantes." },
        { status: 400 }
      );
    }

    const product = await prisma.marketplaceProduct.findUnique({
      where: { id: Number(productId) },
      include: { seller: true },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Produit introuvable." },
        { status: 404 }
      );
    }

    // Création commande Marketplace (statut pending)
    const order = await prisma.marketplaceOrder.create({
      data: {
        buyerId,
        sellerId: product.sellerId,
        productId: product.id,
        total: Math.round(product.price * 100),
        status: "pending",
      },
    });

    // Création session Stripe
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: product.title,
              images: product.coverImageUrl ? [product.coverImageUrl] : [],
            },
            unit_amount: Math.round(product.price * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        orderId: order.id,
        buyerId: buyerId,
        sellerId: product.sellerId,
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/orders/${order.id}?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/marketplace/${product.id}?cancel=1`,
    });

    // Notifier vendeur + acheteur (commande créée)
    await notifyMarketplaceOrderCreated({
      orderId: order.id,
      buyerId,
      sellerId: product.sellerId,
      productTitle: product.title,
    });

    // Retourner l’URL Stripe Checkout au frontend
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Erreur création session checkout:", error);
    return NextResponse.json(
      { error: "Erreur interne checkout." },
      { status: 500 }
    );
  }
}
