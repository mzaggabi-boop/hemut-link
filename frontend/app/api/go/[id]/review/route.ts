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

    if (Number.isNaN(jobId)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    const body = await request.json().catch(() => null);
    const rating = body?.rating;
    const comment = body?.comment ?? null;

    if (!rating || typeof rating !== "number" || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Note invalide (1 à 5)" },
        { status: 400 }
      );
    }

    const supabase = supabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
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
        { error: "Aucun artisan assigné" },
        { status: 400 }
      );
    }

    const artisanId = job.artisanId;

    const existing = await prisma.review.findFirst({
      where: {
        userId: dbUser.id,
        artisanId: artisanId,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Vous avez déjà laissé un avis pour cet artisan" },
        { status: 400 }
      );
    }

    await prisma.review.create({
      data: {
        rating,
        comment,
        userId: dbUser.id,
        artisanId: artisanId,
      },
    });

    const stats = await prisma.review.aggregate({
      where: { artisanId: artisanId },
      _avg: { rating: true },
    });

    await prisma.businessProfile.update({
      where: { userId: artisanId },
      data: { rating: stats._avg.rating ?? 0 },
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


