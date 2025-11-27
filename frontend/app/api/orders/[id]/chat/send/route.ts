// app/api/orders/[id]/chat/send/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { notifyMarketplaceChatMessage } from "@/lib/notifications";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Récupération du paramètre
    const { id } = await context.params;
    const orderId = Number(id);

    if (Number.isNaN(orderId)) {
      return NextResponse.json(
        { error: "ID invalide" },
        { status: 400 }
      );
    }

    // Auth utilisateur
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    // Lecture du message
    const body = await request.json();
    const { content } = body;

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: "Message vide" },
        { status: 400 }
      );
    }

    // Vérification commande
    const order = await prisma.marketplaceOrder.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Commande introuvable" },
        { status: 404 }
      );
    }

    // Déterminer le destinataire du message
    const toUserId =
      user.id === order.buyerId ? order.sellerId : order.buyerId;

    // Enregistrer le message
    const msg = await prisma.marketplaceOrderMessage.create({
      data: {
        orderId,
        senderId: user.id,
        content: content.trim(),
      },
    });

    // Notification
    await notifyMarketplaceChatMessage({
      orderId,
      fromUserId: user.id,
      toUserId,
    });

    return NextResponse.json({ ok: true, message: msg });

  } catch (e) {
    console.error("CHAT SEND ERROR:", e);
    return NextResponse.json(
      { error: "Erreur interne" },
      { status: 500 }
    );
  }
}
