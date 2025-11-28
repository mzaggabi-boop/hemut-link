// frontend/app/api/go/[id]/review/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { supabaseServer } from "@/lib/supabase-server";

type RouteContext = {
  params: { id: string };
};

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    // 🔹 Récupération & validation de l'ID de mission
    const jobId = Number(context.params.id);

    if (Number.isNaN(jobId)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    // 🔹 Corps de la requête
    const body = await request.json().catch(() => null);
    const rating = body?.rating;
    const comment = body?.comment ?? null;

    if (!rating || typeof rating !== "number" || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Note invalide (1 à 5)" },
        { status: 400 }
      );
    }

    // 🔹 Authentification via Supabase
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

    // 🔹 Vérifier la mission GO
    const job = await prisma.goJob.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return NextResponse.json(
        { error: "Mission introuvable" },
        { status: 404 }
      );
    }

    // Le client doit être le propriétaire de la mission
    if (job.clientId !== dbUser.id) {
      return NextResponse.json(
        { error: "Vous ne pouvez évaluer que vos propres missions" },
        { status: 403 }
      );
    }

    // L'artisan doit être assigné
    if (!job.artisanId) {
      return NextResponse.json(
        { error: "Aucun artisan assigné" },
        { status: 400 }
      );
    }

    const artisanId = job.artisanId;

    // 🔹 Vérifier si déjà évalué (par user pour cet artisan)
    // 👉 Le modèle Prisma n'a PAS de jobId sur Review,
    //    donc on se base sur (userId + artisanId).
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

    // 🔹 Créer l’avis
    await prisma.review.create({
      data: {
        rating,
        comment,
        userId: dbUser.id,
        artisanId: artisanId,
      },
    });

    // 🔹 Recalcul de la note moyenne de l'artisan
    const stats = await prisma.review.aggregate({
      where: { artisanId: artisanId },
      _avg: { rating: true },
    });

    await prisma.businessProfile.update({
      where: { userId: artisanId },
      data: {
        rating: stats._avg.rating ?? 0,
      },
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
