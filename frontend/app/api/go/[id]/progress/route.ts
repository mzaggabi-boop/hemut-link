// app/api/go/[id]/progress/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { supabaseServer } from "@/lib/supabase-server";

const VALID_STEPS = [
  "ARTISAN_EN_ROUTE",
  "ARTISAN_ARRIVE",
  "TRAVAIL_EN_COURS",
  "TRAVAIL_TERMINE",
  "EN_ATTENTE_VALIDATION_CLIENT",
] as const;

type GoJobStep = (typeof VALID_STEPS)[number];

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const jobId = Number(id);

    if (Number.isNaN(jobId)) {
      return NextResponse.json(
        { error: "ID mission invalide." },
        { status: 400 }
      );
    }

    const { step } = await request.json();

    if (!step || typeof step !== "string") {
      return NextResponse.json(
        { error: "Étape manquante." },
        { status: 400 }
      );
    }

    if (!VALID_STEPS.includes(step as GoJobStep)) {
      return NextResponse.json(
        {
          error: "Étape invalide.",
          allowed: VALID_STEPS,
        },
        { status: 400 }
      );
    }

    const supabase = await supabaseServer();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Non authentifié." },
        { status: 401 }
      );
    }

    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: "Utilisateur inconnu." },
        { status: 404 }
      );
    }

    const job = await prisma.goJob.findUnique({
      where: { id: jobId },
      include: { artisan: true },
    });

    if (!job) {
      return NextResponse.json(
        { error: "Mission introuvable." },
        { status: 404 }
      );
    }

    if (job.artisanId !== dbUser.id) {
      return NextResponse.json(
        { error: "Vous n'êtes pas l'artisan assigné à cette mission." },
        { status: 403 }
      );
    }

    await prisma.goJobProgress.create({
      data: {
        jobId,
        step: step as GoJobStep,
        actorId: dbUser.id,
      },
    });

    await prisma.goJob.update({
      where: { id: jobId },
      data: { currentStep: step as GoJobStep },
    });

    return NextResponse.json({
      ok: true,
      message: "Progression enregistrée.",
      step,
    });
  } catch (error) {
    console.error("Erreur GO PROGRESS:", error);
    return NextResponse.json(
      { error: "Erreur interne." },
      { status: 500 }
    );
  }
}
