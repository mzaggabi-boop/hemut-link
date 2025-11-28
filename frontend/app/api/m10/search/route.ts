// app/api/m10/search/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() || "";

  if (!q) {
    return NextResponse.json({ results: [] });
  }

  const search = q.toLowerCase();

  // Recherche PRODUITS
  const products = await prisma.marketplaceProduct.findMany({
    where: {
      title: { contains: search, mode: "insensitive" },
    },
    take: 10,
  });

  // Recherche COMMANDES
  const orders = await prisma.marketplaceOrder.findMany({
    include: {
      buyer: true,
      seller: true,
      product: true,
    },
    where: {
      OR: [
        { status: { contains: search, mode: "insensitive" } },
        {
          buyer: {
            OR: [
              { firstname: { contains: search, mode: "insensitive" } },
              { lastname: { contains: search, mode: "insensitive" } },
            ],
          },
        },
        {
          product: {
            title: { contains: search, mode: "insensitive" },
          },
        },
      ],
    },
    take: 10,
  });

  // Recherche MISSIONS GO
  const jobs = await prisma.goJob.findMany({
    include: {
      client: true,
      artisan: true,
    },
    where: {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { address: { contains: search, mode: "insensitive" } },
      ],
    },
    take: 10,
  });

  const results = [
    ...products.map((p) => ({
      type: "PRODUCT",
      id: p.id,
      title: p.title,
      subtitle: "Produit Marketplace",
    })),

    ...orders.map((o) => ({
      type: "ORDER",
      id: o.id,
      title: o.product?.title ?? "Commande",
      subtitle: `Client: ${o.buyer?.firstname ?? ""} ${o.buyer?.lastname ?? ""}`,
    })),

    ...jobs.map((j) => ({
      type: "GO",
      id: j.id,
      title: j.title,
      subtitle: j.address ?? "Mission GO",
    })),
  ];

  return NextResponse.json({ results });
}
