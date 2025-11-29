// app/api/transactions/list/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { supabaseServer } from "@/lib/supabase-server";

export async function GET() {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
  });

  if (!dbUser) {
    return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
  }

  const payments = await prisma.payment.findMany({
    where: { receiverId: dbUser.id },
    include: {
      sender: true,
      order: {
        include: {
          items: { include: { product: true } },
        },
      },
      job: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const normalized = payments.map((p) => {
    const type = p.order ? "Commande" : p.job ? "Mission Go" : "Autre";
    const label = p.order?.items?.[0]?.product?.title || p.job?.title || "—";

    return {
      id: p.id,
      createdAt: p.createdAt,
      type,
      label,
      client: p.sender?.email || "",
      amount: p.amount,
      commission: p.commission,
    };
  });

  return NextResponse.json({
    payments: normalized,
  });
}
