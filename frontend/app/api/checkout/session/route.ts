// app/api/checkout/session/route.ts

export const runtime = "nodejs";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { notifyMarketplaceOrderCreated } from "@/lib/notifications";
import stripe from "@/lib/stripe";

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

    const order = await prisma.marketplaceOrder.create({
      data: {
        buyerId,
        sellerId: product.sellerId,
        productId: product.id,
        total: Math.round(product.price * 100),
        status: "pending",
      },
    });

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
        buyerId,
        sellerId: product.sellerId,
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/orders/${order.id}?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/marketplace/${product.id}?cancel=1`,
    });

    await notifyMarketplaceOrderCreated({
      orderId: order.id,
      buyerId,
      sellerId: product.sellerId,
      productTitle: product.title,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur interne checkout." },
      { status: 500 }
    );
  }
}
