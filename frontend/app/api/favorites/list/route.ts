// FAVORITES LIST API - A REMPLACER
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { supabaseServer } from "@/lib/supabase-server";

export async function GET() {
  try {
    const supabase = supabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user)
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );

    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
    });

    if (!dbUser)
      return NextResponse.json(
        { error: "Utilisateur introuvable" },
        { status: 404 }
      );

    const favorites = await prisma.marketplaceFavorite.findMany({
      where: { userId: dbUser.id },
      include: {
        product: {
          include: {
            photos: true,
            category: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ favorites });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
