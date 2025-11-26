import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { supabaseServer } from "@/lib/supabase-server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, price, condition, description, categoryId, photos, tags } = body;

    const supabase = supabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

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

    if (!title || !price) {
      return NextResponse.json(
        { error: "Titre et prix sont obligatoires." },
        { status: 400 }
      );
    }

    const product = await prisma.marketplaceProduct.create({
      data: {
        title,
        description,
        price,
        condition,
        categoryId: categoryId || null,
        sellerId: dbUser.id,
        photos:
          photos && Array.isArray(photos)
            ? {
                create: photos.map((url: string) => ({ url })),
              }
            : undefined,
      },
    });

    // GESTION DES TAGS
    if (tags && Array.isArray(tags) && tags.length > 0) {
      const createdTags = await Promise.all(
        tags.map((name: string) =>
          prisma.tag.upsert({
            where: { name },
            update: {},
            create: { name },
          })
        )
      );

      await prisma.productTag.createMany({
        data: createdTags.map((t) => ({
          productId: product.id,
          tagId: t.id,
        })),
        skipDuplicates: true,
      });
    }

    return NextResponse.json({ success: true, product });
  } catch (e) {
    console.error("PRODUCT CREATE ERROR", e);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
