// FAVORITES TOGGLE API - A REMPLACER
// app/api/favorites/toggle/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { supabaseServer } from "@/lib/supabase-server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const productId = Number(body.productId);

    if (!productId)
      return NextResponse.json(
        { error: "Product ID manquant" },
        { status: 400 }
      );

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

    const existing = await prisma.marketplaceFavorite.findUnique({
      where: {
        userId_productId: {
          userId: dbUser.id,
          productId,
        },
      },
    });

    if (existing) {
      await prisma.marketplaceFavorite.delete({
        where: { id: existing.id },
      });

      return NextResponse.json({ favorite: false });
    }

    await prisma.marketplaceFavorite.create({
      data: {
        userId: dbUser.id,
        productId,
      },
    });

    return NextResponse.json({ favorite: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
