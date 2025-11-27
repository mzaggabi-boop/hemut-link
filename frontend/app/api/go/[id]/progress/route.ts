// frontend/app/api/go/[id]/progress/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { supabaseServer } from "@/lib/supabase-server";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // 🔧 RÉCUPERATION ID
    const { id } = await context.params;
    const jobId = Number(id);

    if (Number.isNaN(jobId)) {
      return NextResponse.json(
        { error: "ID mission invalide." },
        { status: 400 }
      );
    }

    // 📥 RÉCUPÉRER LE STEP
    const { step } = await request.json();

    if (!step || typeof step !== "string") {
      return NextResponse.json(
        { error: "Étape invalide." },
        { status: 400 }
      );
    }

    // 👤 AUTH SUPABASE
    const supabase = supabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
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

    // 🔍 RÉCUPÉRER LA MISSION
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

    // 🚫 Vérifier que l'artisan est bien celui assigné
    if (job.artisanId !== dbUser.id) {
      return NextResponse.json(
        { error: "Vous n'êtes pas l'artisan assigné à cette mission." },
        { status: 403 }
      );
    }

    // 📝 AJOUTER L'HISTORIQUE
    await prisma.goJobProgress.create({
      data: {
        jobId,
        step,
        actorId: dbUser.id,
      },
    });

    // 🔄 METTRE À JOUR LA MISSION
    await prisma.goJob.update({
      where: { id: jobId },
      data: { currentStep: step },
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
