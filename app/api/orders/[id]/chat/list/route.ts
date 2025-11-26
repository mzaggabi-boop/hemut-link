// app/api/orders/[orderId]/chat/list/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ messages: [] });

  const orderId = Number(params.orderId);

  const messages = await prisma.marketplaceOrderMessage.findMany({
    where: { orderId },
    orderBy: { createdAt: "asc" },
    include: {
      sender: true,
    },
  });

  return NextResponse.json({ messages });
}
