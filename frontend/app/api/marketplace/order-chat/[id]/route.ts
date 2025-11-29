import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { supabaseServer } from "@/lib/supabase-server";

// ---------- GET ----------
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const orderId = Number(id);

  const messages = await prisma.marketplaceOrderMessage.findMany({
    where: { orderId },
    include: { sender: true },
    orderBy: { createdAt: "asc" },
    take: 200,
  });

  return NextResponse.json({ messages });
}

// ---------- POST ----------
export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const orderId = Number(id);

  const { content, imageUrl } = await req.json();

  // Auth FIX
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user)
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
  });

  if (!dbUser)
    return NextResponse.json({ error: "Compte introuvable" }, { status: 404 });

  const order = await prisma.marketplaceOrder.findUnique({
    where: { id: orderId },
  });

  if (!order)
    return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });

  if (order.buyerId !== dbUser.id && order.sellerId !== dbUser.id)
    return NextResponse.json(
      { error: "Vous ne faites pas partie de cette commande" },
      { status: 403 }
    );

  const msg = await prisma.marketplaceOrderMessage.create({
    data: {
      orderId,
      senderId: dbUser.id,
      content,
      imageUrl,
    },
  });

  return NextResponse.json({ success: true, message: msg });
}
