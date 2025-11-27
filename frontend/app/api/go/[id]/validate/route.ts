// app/api/go/[id]/validate/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { supabaseServer } from "@/lib/supabase-server";

export async function POST(
  req: Request,
   context: { params: Promise<{ id: string }> }
) {
  try {
    const jobId = parseInt(context.params.id);
    if (isNaN(jobId)) {
      return NextResponse.json(
        { error: "ID de mission invalide." },
        { status: 400 }
      );
    }

    // AUTH
    const supabase = supabaseServer();
    const { data: { user } } = await supabase.auth.getUser();

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
        { error: "Utilisateur introuvable." },
        { status: 404 }
      );
    }

    // CHARGER LA MISSION
    const job = await prisma.goJob.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return NextResponse.json(
        { error: "Mission introuvable." },
        { status: 404 }
      );
    }

    // SEUL LE CLIENT PEUT VALIDER
    if (job.clientId !== dbUser.id) {
      return NextResponse.json(
        { error: "Vous n'êtes pas le client de cette mission." },
        { status: 403 }
      );
    }

    // DÉJÀ TERMINÉE ?
    if (job.status === "COMPLETED") {
      return NextResponse.json(
        { error: "La mission est déjà validée." },
        { status: 400 }
      );
    }

    // MISE À JOUR FINALE
    await prisma.goJob.update({
      where: { id: jobId },
      data: {
        status: "COMPLETED",
        currentStep: "EN_ATTENTE_VALIDATION_CLIENT",
      },
    });

    return NextResponse.json(
      { success: true, message: "Mission validée avec succès." },
      { status: 200 }
    );
  } catch (err) {
    console.error("GO VALIDATE ERROR:", err);
    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}
