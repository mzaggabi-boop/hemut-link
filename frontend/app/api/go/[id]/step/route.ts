import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  notifyGoClientStep,
  notifyGoArtisanAssigned,
} from "@/lib/notifications";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId: jobIdStr } = await context.params;
    const jobId = Number(jobIdStr);

    if (Number.isNaN(jobId)) {
      return NextResponse.json(
        { error: "ID mission non valide." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { step } = body;

    if (!step) {
      return NextResponse.json(
        { error: "Aucune étape fournie." },
        { status: 400 }
      );
    }

    const job = await prisma.goJob.findUnique({
      where: { id: jobId },
      include: { client: true, artisan: true },
    });

    if (!job) {
      return NextResponse.json(
        { error: "Mission introuvable." },
        { status: 404 }
      );
    }

    await prisma.goJob.update({
      where: { id: jobId },
      data: { currentStep: step },
    });

    await prisma.goJobProgress.create({
      data: {
        jobId,
        step,
        actorId: job.artisanId ?? null,
      },
    });

    await notifyGoClientStep({
      clientId: job.clientId,
      jobId,
      stepLabel: step.replace(/_/g, " ").toLowerCase(),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erreur step GO:", error);
    return NextResponse.json(
      { error: "Erreur interne." },
      { status: 500 }
    );
  }
}
