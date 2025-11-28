// frontend/app/api/go/[id]/review/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { supabaseServer } from "@/lib/supabase-server";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ OBLIGATOIRE SUR NEXT 16 : await params
    const { id } = await context.params;
    const jobId = Number(id);

    if (Number.isNaN(jobId)) {
      return NextResponse.json(
        { error: "ID invalide" },
        { status: 400 }
      );
    }

    const { rating, comment } = await request.json();

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Note invalide (1 à 5)" },
        { status: 400 }
      );
    }

    // 🔐 AUTH SUPABASE
    const supabase = supabaseServer();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: "Utilisateur introuvable" },
        { status: 404 }
      );
    }

    // 🔍 Vérifier la mission
    const job = await prisma.goJob.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return NextResponse.json(
        { error: "Mission introuvable" },
        { status: 404 }
      );
    }

    if (job.clientId !== dbUser.id) {
      return NextResponse.json(
        { error: "Vous ne pouvez évaluer que vos propres missions" },
        { status: 403 }
      );
    }

    if (!job.artisanId) {
      return NextResponse.json(
        { error: "Aucun artisan assigné à cette mission" },
        { status: 400 }
      );
    }

    // 🛑 Vérifier si déjà évalué
    const existing = await prisma.review.findFirst({
      where: { userId: dbUser.id, artisanId: job.artisanId, jobId },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Vous avez déjà laissé un avis pour cette mission" },
        { status: 400 }
      );
    }

    // 📝 Créer l’avis
    await prisma.review.create({
      data: {
        rating,
        comment,
        userId: dbUser.id,
        artisanId: job.artisanId,
        jobId,
      },
    });

    // ⭐ Mise à jour moyenne artisan
    const stats = await prisma.review.aggregate({
      where: { artisanId: job.artisanId },
      _avg: { rating: true },
    });

    await prisma.businessProfile.update({
      where: { userId: job.artisanId },
      data: { rating: stats._avg.rating || 0 },
    });

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("REVIEW ERROR:", err);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
