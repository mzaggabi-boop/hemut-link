import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const jobId = Number(id);

    const body = await request.json();
    const { step } = body;

    if (!step) {
      return NextResponse.json({ error: "Step obligatoire." }, { status: 400 });
    }

    if (Number.isNaN(jobId)) {
      return NextResponse.json({ error: "ID invalide." }, { status: 400 });
    }

    await prisma.goJob.update({
      where: { id: jobId },
      data: { currentStep: step },
    });

    await prisma.goJobProgress.create({
      data: {
        jobId,
        step,
        actorId: null,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erreur UPDATE-STEP:", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
