// frontend/app/api/go/[id]/complete/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { notifyGoClientCompleted } from "@/lib/notifications";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }   // ✅ FIX: Promise ajoutée
) {
  try {
    const { id } = await context.params;  // ✅ FIX: await ajouté
    const jobId = Number(id);

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

    // Mise à jour de la mission
    await prisma.goJob.update({
      where: { id: jobId },
      data: {
        status: "COMPLETED",
        currentStep: "TRAVAIL_TERMINE",
      },
    });

    // Historique
    await prisma.goJobProgress.create({
      data: {
        jobId,
        step: "TRAVAIL_TERMINE",
        actorId: job.artisanId ?? null,
      },
    });

    // Notification
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