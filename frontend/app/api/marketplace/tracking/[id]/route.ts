import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const orderId = Number(id);

    if (Number.isNaN(orderId)) {
      return NextResponse.json(
        { error: "ID invalide." },
        { status: 400 }
      );
    }

    const data = await request.json();
    const { status } = data;

    if (!status) {
      return NextResponse.json(
        { error: "Statut manquant." },
        { status: 400 }
      );
    }

    const order = await prisma.marketplaceOrder.update({
      where: { id: orderId },
      data: { trackingStatus: status },
    });

    return NextResponse.json({
      success: true,
      order,
    });

  } catch (err) {
    console.error("TRACKING ERROR:", err);
    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}
