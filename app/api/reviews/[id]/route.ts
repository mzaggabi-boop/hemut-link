// app/api/reviews/stats/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/reviews/stats/[id]
 * Renvoie :
 * {
 *   artisanId: number,
 *   average: number,
 *   count: number
 * }
 */
export async function GET(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    const artisanId = Number(context.params.id);

    if (Number.isNaN(artisanId)) {
      return NextResponse.json(
        { error: "ID artisan invalide." },
        { status: 400 }
      );
    }

    // Récupérer toutes les notes
    const stats = await prisma.review.groupBy({
      by: ["artisanId"],
      where: { artisanId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    // Aucun avis ?
    if (stats.length === 0) {
      return NextResponse.json(
        {
          artisanId,
          average: 0,
          count: 0,
        },
        { status: 200 }
      );
    }

    const record = stats[0];

    return NextResponse.json(
      {
        artisanId,
        average: record._avg.rating ?? 0,
        count: record._count.rating,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("REVIEWS STATS ERROR:", err);
    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}
