// app/api/reviews/list/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  context: { params: { id: string } }
) {
  const artisanId = Number(context.params.id);

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
          firstname: true,
          lastname: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json({ reviews }, { status: 200 });
}
