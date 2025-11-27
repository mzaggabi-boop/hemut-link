import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { notifyGoClientCompleted } from "@/lib/notifications";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jobId = Number(params.id);

    if (Number.isNaN(jobId)) {
      return NextResponse.json(
        { error: "ID mission non valide." },
        { status: 400 }
      );
    }

    const job = await prisma.goJob.findUnique({
      where: { id: jobId },
      include: { client: true },
    });

    if (!job) {
      return NextResponse.json(
        { error: "Mission introuvable." },
        { status: 404 }
      );
    }

    await prisma.goJob.update({
      where: { id: jobId },
      data: {
        status: "COMPLETED",
        currentStep: "TRAVAIL_TERMINE",
      },
    });

    await prisma.goJobProgress.create({
      data: {
        jobId,
        step: "TRAVAIL_TERMINE",
        actorId: job.artisanId ?? null,
      },
    });

    await notifyGoClientCompleted({
      clientId: job.clientId,
      jobId,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erreur complete GO:", error);
    return NextResponse.json(
      { error: "Erreur interne." },
      { status: 500 }
    );
  }
}
