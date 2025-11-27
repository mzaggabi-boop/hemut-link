import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const jobId = Number(id);

    if (Number.isNaN(jobId)) {
      return NextResponse.json({ error: "ID invalide." }, { status: 400 });
    }

    const steps = await prisma.goJobProgress.findMany({
      where: { jobId },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ steps });
  } catch (error) {
    console.error("Erreur PROGRESS:", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
