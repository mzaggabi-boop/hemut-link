// app/api/m10/litige/[orderId]/reply/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await context.params;
    const numericOrderId = Number(orderId);

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }

    if (Number.isNaN(numericOrderId)) {
      return NextResponse.json(
        { error: "ID commande invalide." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { message } = body;

    if (!message?.trim()) {
      return NextResponse.json(
        { error: "Message vide." },
        { status: 400 }
      );
    }

    const order = await prisma.marketplaceOrder.findUnique({
      where: { id: numericOrderId },
    });

    if (!order || order.status !== "dispute") {
      return NextResponse.json(
        { error: "Litige introuvable pour cette commande." },
        { status: 404 }
      );
    }

    await prisma.disputeMessage.create({
      data: {
        orderId: numericOrderId,
        senderId: user.id,
        content: message.trim(),
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erreur réponse litige:", error);
    return NextResponse.json(
      { error: "Erreur interne." },
      { status: 500 }
    );
  }
}
