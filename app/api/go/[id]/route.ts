// app/api/go/[id]/review/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { supabaseServer } from "@/lib/supabase-server";

export async function POST(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    const jobId = parseInt(context.params.id);
    if (isNaN(jobId)) {
      return NextResponse.json(
        { error: "ID de mission invalide." },
        { status: 400 }
      );
    }

    const { rating, comment } = await req.json();

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Note invalide, doit être entre 1 et 5." },
        { status: 400 }
      );
    }

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

    const job = await prisma.goJob.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return NextResponse.json(
        { error: "Mission introuvable." },
        { status: 404 }
      );
    }

    if (job.clientId !== dbUser.id) {
      return NextResponse.json(
        { error: "Seul le client peut laisser un avis." },
        { status: 403 }
      );
    }

    if (job.status !== "COMPLETED") {
      return NextResponse.json(
        { error: "La mission doit d’abord être validée avant avis." },
        { status: 400 }
      );
    }

    // Un seul avis autorisé par mission
    const existing = await prisma.review.findFirst({
      where: { userId: dbUser.id, artisanId: job.artisanId! },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Avis déjà déposé." },
        { status: 400 }
      );
    }

    await prisma.review.create({
      data: {
        rating,
        comment,
        userId: dbUser.id,
        artisanId: job.artisanId!,
      },
    });

    return NextResponse.json(
      { success: true, message: "Avis enregistré." },
      { status: 200 }
    );
  } catch (err) {
    console.error("REVIEW ERROR:", err);
    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}
