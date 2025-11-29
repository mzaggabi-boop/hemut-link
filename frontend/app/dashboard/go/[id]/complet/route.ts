// app/api/dashboard/go/[id]/complete/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { supabaseServer } from "@/lib/supabase-server";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const jobId = Number(id);

    if (isNaN(jobId)) {
      return NextResponse.json(
        { error: "ID invalide." },
        { status: 400 }
      );
    }

    // Auth
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
        { error: "Utilisateur introuvable." },
        { status: 404 }
      );
    }

    const artisanId = dbUser.id;

    // Récupération mission
    const job = await prisma.goJob.findUnique({
      where: { id: jobId },
      include: {
        payments: true,
        client: true,
      },
    });

    if (!job) {
      return NextResponse.json(
        { error: "Mission introuvable." },
        { status: 404 }
      );
    }

    // Vérification artisan assigné
    if (job.artisanId !== artisanId) {
      return NextResponse.json(
        { error: "Vous ne pouvez pas terminer cette mission." },
        { status: 403 }
      );
    }

    // Déjà terminée
    if (job.status === "COMPLETED") {
      return NextResponse.json(
        { success: true, message: "Mission déjà marquée terminée." },
        { status: 200 }
      );
    }

    // Marquer terminée
    await prisma.goJob.update({
      where: { id: jobId },
      data: { status: "COMPLETED" },
    });

    // Paiements associés → succeeded
    if (job.payments.length > 0) {
      await prisma.payment.updateMany({
        where: { jobId },
        data: { status: "SUCCEEDED" },
      });
    }

    return NextResponse.json(
      { success: true, message: "Mission terminée avec succès !" },
      { status: 200 }
    );
  } catch (err) {
    console.error("GO COMPLETE ERROR:", err);
    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}
