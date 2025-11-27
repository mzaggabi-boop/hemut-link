import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const jobId = Number(id);

    if (Number.isNaN(jobId)) {
      return NextResponse.json({ error: "ID invalide." }, { status: 400 });
    }

    await prisma.goJob.update({
      where: { id: jobId },
      data: {
        status: "IN_PROGRESS",
        currentStep: "EN_ROUTE",
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erreur START:", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
