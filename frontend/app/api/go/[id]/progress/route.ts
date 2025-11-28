// frontend/app/api/go/[id]/progress/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { supabaseServer } from "@/lib/supabase-server";

// Enum local → DOIT correspondre à Prisma
const VALID_STEPS = [
  "REQUESTED",
  "ACCEPTED",
  "IN_PROGRESS",
  "DONE",
  "CANCELLED",
] as const;

type GoJobStep = (typeof VALID_STEPS)[number];

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // ID mission
    const { id } = await context.params;
    const jobId = Number(id);

    if (Number.isNaN(jobId)) {
      return NextResponse.json(
        { error: "ID mission invalide." },
        { status: 400 }
      );
    }

    // Données envoyées
    const body = await request.json();
    let step = body.step;

    if (!step || typeof step !== "string") {
      return NextResponse.json(
        { error: "Étape absente ou invalide." },
        { status: 400 }
      );
    }

    // Normalisation (strings du frontend → enum Prisma)
    step = step.toUpperCase();

    if (!VALID_STEPS.includes(step as GoJobStep)) {
      return NextResponse.json(
        { error: "Étape non reconnue : " + step },
        { status: 400 }
      );
    }

    // Auth Supabase
    const supabase = supabaseServer();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: "Utilisateur introuvable." },
        { status: 404 }
      );
    }

    // Récupérer la mission
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

    // Vérification artisan assigné
    if (job.artisanId !== dbUser.id) {
      return NextResponse.json(
        { error: "Vous n'êtes pas l'artisan assigné à cette mission." },
        { status: 403 }
      );
    }

    // Ajouter progression
    await prisma.goJobProgress.create({
      data: {
        jobId,
        step: step as GoJobStep,
        actorId: dbUser.id,
      },
    });

    // Mettre à jour étape courante
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

