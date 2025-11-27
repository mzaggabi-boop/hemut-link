import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { supabaseServer } from "@/lib/supabase-server";

export async function GET() {
  try {
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
      return new NextResponse("Utilisateur introuvable", { status: 404 });
    }

    const transactions = await prisma.payment.findMany({
      where: {
        OR: [
          { senderId: dbUser.id },
          { receiverId: dbUser.id },
        ],
      },
      orderBy: { createdAt: "desc" },
    });

    const csvHeaders = [
      "id",
      "jobId",
      "orderId",
      "senderId",
      "receiverId",
      "amount",
      "commission",
      "status",
      "stripePaymentIntentId",
      "createdAt",
      "updatedAt",
    ];

    const csvRows = transactions.map((t) =>
      [
        t.id,
        t.jobId ?? "",
        t.orderId ?? "",
        t.senderId,
        t.receiverId,
        t.amount,
        t.commission,
        t.status,
        t.stripePaymentIntentId,
        t.createdAt.toISOString(),
        t.updatedAt.toISOString(),
      ].join(",")
    );

    const csvContent = [csvHeaders.join(","), ...csvRows].join("\n");

    return new Response(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="transactions.csv"`,
      },
    });
  } catch (error) {
    console.error("EXPORT TRANSACTIONS ERROR", error);
    return new NextResponse("Erreur serveur", { status: 500 });
  }
}

