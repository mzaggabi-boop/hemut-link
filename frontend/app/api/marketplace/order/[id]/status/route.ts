import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  req: Request,
  context: { params: { id: string } }
) {
  const orderId = Number(context.params.id);
  const body = await req.json();
  const { status } = body;

  const allowed = ["preparing", "shipped", "delivered", "canceled"];

  if (!allowed.includes(status)) {
    return NextResponse.json(
      { error: "Statut invalide." },
      { status: 400 }
    );
  }

  const order = await prisma.marketplaceOrder.update({
    where: { id: orderId },
    data: { status },
  });

  return NextResponse.json({ success: true, order });
}
