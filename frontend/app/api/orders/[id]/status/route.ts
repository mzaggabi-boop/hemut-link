import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // paramètre dynamique
    const { id } = await context.params;
    const orderId = Number(id);

    if (Number.isNaN(orderId)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    // Auth obligatoire
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    // Récupération du statut à mettre à jour
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: "Statut manquant" },
        { status: 400 }
      );
    }

    // Vérifier que la commande existe
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Commande introuvable" },
        { status: 404 }
      );
    }

    // Vérifier que c'est l'utilisateur concerné
    if (order.buyerId !== user.id && order.sellerId !== user.id) {
      return NextResponse.json(
        { error: "Accès interdit" },
        { status: 403 }
      );
    }

    // Mise à jour du statut
    const updated = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    return NextResponse.json({
      ok: true,
      order: updated,
    });

  } catch (err) {
    console.error("ORDER STATUS ERROR:", err);
    return NextResponse.json(
      { error: "Erreur interne" },
      { status: 500 }
    );
  }
}
