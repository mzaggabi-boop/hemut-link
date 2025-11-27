// app/api/orders/[id]/chat/list/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Récupération param id
    const { id } = await context.params;
    const orderId = Number(id);

    // Auth
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ messages: [] });
    }

    if (Number.isNaN(orderId)) {
      return NextResponse.json(
        { error: "ID commande invalide." },
        { status: 400 }
      );
    }

    // Récupération messages
    const messages = await prisma.marketplaceOrderMessage.findMany({
      where: { orderId },
      orderBy: { createdAt: "asc" },
      include: {
        sender: true,
      },
    });

    return NextResponse.json({ messages });

  } catch (error) {
    console.error("CHAT LIST ERROR:", error);
    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}
