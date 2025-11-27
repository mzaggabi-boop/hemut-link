// TAGS LIST API - A REMPLACER
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const categoryIdParam = searchParams.get("categoryId");
    const categoryId = categoryIdParam ? Number(categoryIdParam) : null;

    const where: any = {
      ...(q && {
        name: { contains: q, mode: "insensitive" },
      }),
      // Option : limiter aux tags utilisés dans une catégorie donnée
      ...(categoryId && {
        products: {
          some: {
            product: {
              categoryId,
            },
          },
        },
      }),
    };

    const tags = await prisma.tag.findMany({
      where,
      include: {
        parent: true,
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: [
        // Tags les plus utilisés en premier
        { products: { _count: "desc" } },
        { name: "asc" },
      ],
      take: 50,
    });

    return NextResponse.json({
      tags: tags.map((t) => ({
        id: t.id,
        name: t.name,
        parentId: t.parentId,
        parentName: t.parent?.name || null,
        usageCount: t._count.products,
      })),
    });
  } catch (e) {
    console.error("TAGS LIST ERROR", e);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

