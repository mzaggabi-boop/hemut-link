// app/api/reviews/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const artisanId = Number(id);

    if (Number.isNaN(artisanId)) {
      return NextResponse.json(
        { error: "ID artisan invalide." },
        { status: 400 }
      );
    }

    // Récupérer les avis
    const reviews = await prisma.review.findMany({
      where: { artisanId },
      orderBy: { createdAt: "desc" },
      include: {
        author: true,
      },
    });

    // Calcul moyenne + nombre
    const average =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    return NextResponse.json(
      {
        artisanId,
        count: reviews.length,
        average,
        reviews,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("REVIEWS [id] ERROR:", err);
    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}
