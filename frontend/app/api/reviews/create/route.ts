// app/api/reviews/create/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { supabaseServer } from "@/lib/supabase-server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { artisanId, rating, comment } = body;

    if (!artisanId || !rating) {
      return NextResponse.json(
        { error: "artisanId et rating requis." },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "La note doit être entre 1 et 5." },
        { status: 400 }
      );
    }

    // AUTH
    const supabase = supabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user)
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
    });

    if (!dbUser)
      return NextResponse.json(
        { error: "Utilisateur introuvable." },
        { status: 404 }
      );

    // CRÉER AVIS
    await prisma.review.create({
      data: {
        artisanId,
        rating,
        comment: comment || null,
        userId: dbUser.id,
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    console.error("CREATE REVIEW ERROR:", err);
    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}

