// app/api/orders/[orderId]/chat/send/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { notifyMarketplaceChatMessage } from "@/lib/notifications";

export async function POST(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    const orderId = Number(params.orderId);
    if (Number.isNaN(orderId))
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });

    const body = await req.json();
    const { content } = body;

    if (!content || !content.trim())
      return NextResponse.json({ error: "Message vide" }, { status: 400 });

    const order = await prisma.marketplaceOrder.findUnique({
      where: { id: orderId },
    });

    if (!order)
      return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });

    // déterminer le destinataire
    const toUserId =
      user.id === order.buyerId ? order.sellerId : order.buyerId;

    // enregistrement du message
    const msg = await prisma.marketplaceOrderMessage.create({
      data: {
        orderId,
        senderId: user.id,
        content: content.trim(),
      },
    });

    // notification du destinataire
    await notifyMarketplaceChatMessage({
      orderId,
      fromUserId: user.id,
      toUserId,
    });

    return NextResponse.json({ ok: true, message: msg });
  } catch (e) {
    console.error("Error:", e);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
