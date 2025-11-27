// app/api/go/[jobId]/step/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  notifyGoClientStep,
  notifyGoArtisanAssigned,
} from "@/lib/notifications";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ jobId: string }> }  // ✅ FIX: Promise ajoutée
) {
  try {
    const { jobId: jobIdStr } = await params;  // ✅ FIX: await ajouté
    const jobId = Number(jobIdStr);
    
    if (Number.isNaN(jobId)) {
      return NextResponse.json(
        { error: "ID mission non valide." },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { step } = body;

    if (!step) {
      return NextResponse.json(
        { error: "Aucune étape fournie." },
        { status: 400 }
      );
    }

    // Vérifier que la mission existe
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

    // Mise à jour de l'étape actuelle
    await prisma.goJob.update({
      where: { id: jobId },
      data: { currentStep: step },
    });

    // Ajout à l'historique
    await prisma.goJobProgress.create({
      data: {
        jobId,
        step,
        actorId: job.artisanId ?? null,
      },
    });

    // ================
    //   NOTIFICATION CLIENT
    // ================
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