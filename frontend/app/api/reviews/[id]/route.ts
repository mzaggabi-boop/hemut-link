// app/api/reviews/stats/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
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
  _req: NextRequest,
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

    // Récupérer stats
    const stats = await prisma.review.groupBy({
      by: ["artisanId"],
      where: { artisanId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    if (stats.length === 0) {
      return NextResponse.json(
        { artisanId, average: 0, count: 0 },
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
  } catch (err) {
    console.error("REVIEWS STATS ERROR:", err);
    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}
