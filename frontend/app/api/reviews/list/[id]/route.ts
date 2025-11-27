import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const artisanId = Number(id);

    if (Number.isNaN(artisanId)) {
      return NextResponse.json(
        { error: "ID invalide." },
        { status: 400 }
      );
    }

    const reviews = await prisma.review.findMany({
      where: { artisanId },
      include: {
        user: {
          select: {
            email: true,
            firstname: true,
            lastname: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("REVIEWS LIST ERROR:", error);
    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}
