// CODE � COLLER
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { supabaseServer } from "@/lib/supabase-server";

export async function GET() {
  const supabase = supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new NextResponse("Non authentifié", { status: 401 });
  }

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
  });

  if (!dbUser) {
    return new NextResponse("Utilisateur inconnu", { status: 404 });
  }

  const payments = await prisma.payment.findMany({
    where: { receiverId: dbUser.id },
    include: {
      sender: true,
      order: {
        include: {
          items: {
            include: { product: true },
          },
        },
      },
      job: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const rows = [
    [
      "ID Transaction",
      "Date",
      "Type",
      "Produit / Mission",
      "Client",
      "Montant Brut",
      "Commission",
      "Montant Net",
      "Statut",
    ],
  ];

  for (const p of payments) {
    const type = p.order ? "Commande" : p.job ? "Mission Go" : "Autre";

    const label =
      p.order?.items?.[0]?.product?.title ||
      p.job?.title ||
      "—";

    const brut = p.amount;
    const net = p.amount - p.commission;

    rows.push([
      p.id,
      new Date(p.createdAt).toLocaleString("fr-FR"),
      type,
      label,
      p.sender?.email || "",
      brut,
      p.commission,
      net,
      p.status,
    ]);
  }

  const csv = rows.map((r) => r.join(";")).join("\n");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=transactions.csv",
    },
  });
}
