// app/api/marketplace/orders/create/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { supabaseServer } from "@/lib/supabase-server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { error: "productId manquant" },
        { status: 400 }
      );
    }

    // AUTH
    const supabase = supabaseServer();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const buyer = await prisma.user.findUnique({
      where: { supabaseId: user.id },
    });

    if (!buyer) {
      return NextResponse.json(
        { error: "Utilisateur introuvable (Prisma)" },
        { status: 404 }
      );
    }

    // Produit
    const product = await prisma.marketplaceProduct.findUnique({
      where: { id: productId },
      include: { seller: true },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Produit introuvable" },
        { status: 404 }
      );
    }

    if (product.sellerId === buyer.id) {
      return NextResponse.json(
        { error: "Vous ne pouvez pas acheter votre propre produit." },
        { status: 400 }
      );
    }

    // Création commande Marketplace
    const order = await prisma.marketplaceOrder.create({
      data: {
        buyerId: buyer.id,
        sellerId: product.sellerId,
        productId: product.id,
        total: Math.round(product.price), // € → integer
        status: "pending",
      },
    });

    return NextResponse.json({ orderId: order.id }, { status: 200 });
  } catch (err) {
    console.error("ORDER CREATE ERROR:", err);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

