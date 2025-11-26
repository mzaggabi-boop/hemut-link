// app/api/m10/litige/create/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { notifyMarketplaceDisputeOpened } from "@/lib/notifications";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }

    const body = await req.json();
    const { orderId, message } = body;

    const parsedOrderId = Number(orderId);
    if (Number.isNaN(parsedOrderId) || !message?.trim()) {
      return NextResponse.json(
        { error: "Données invalides." },
        { status: 400 }
      );
    }

    const order = await prisma.marketplaceOrder.findUnique({
      where: { id: parsedOrderId },
      include: {
        buyer: true,
        seller: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Commande introuvable." },
        { status: 404 }
      );
    }

    // Seul l'acheteur peut ouvrir un litige (logique de base, ajustable)
    if (order.buyerId !== user.id) {
      return NextResponse.json(
        { error: "Vous ne pouvez pas ouvrir un litige sur cette commande." },
        { status: 403 }
      );
    }

    // Passer la commande en statut "dispute"
    await prisma.marketplaceOrder.update({
      where: { id: order.id },
      data: {
        status: "dispute",
      },
    });

    // Créer le premier message de litige
    await prisma.disputeMessage.create({
      data: {
        orderId: order.id,
        senderId: user.id,
        content: message.trim(),
      },
    });

    // Notifier acheteur + vendeur
    await notifyMarketplaceDisputeOpened({
      orderId: order.id,
      buyerId: order.buyerId,
      sellerId: order.sellerId,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erreur création litige:", error);
    return NextResponse.json(
      { error: "Erreur interne." },
      { status: 500 }
    );
  }
}
