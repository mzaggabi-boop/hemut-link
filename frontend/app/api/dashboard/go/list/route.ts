// app/api/dashboard/go/list/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { supabaseServer } from "@/lib/supabase-server";

export async function GET() {
  try {
    // AUTH
    const supabase = supabaseServer();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user)
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
    });

    if (!dbUser)
      return NextResponse.json({ error: "Utilisateur introuvable." }, { status: 404 });

    const artisanId = dbUser.id;

    // RÉCUPÉRATION DES MISSIONS
    const jobs = await prisma.goJob.findMany({
      where: { artisanId },
      include: {
        payments: true,
        photos: true,
        client: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // CLASSEMENT PAR STATUT
    const waiting = jobs.filter(j => j.status === "ACCEPTED");
    const inProgress = jobs.filter(j => j.status === "IN_PROGRESS");
    const completed = jobs.filter(j => j.status === "COMPLETED");

    // STATISTIQUES
    const totalEarned = jobs
      .filter(j => j.status === "COMPLETED" && j.payments.length > 0)
      .reduce((sum, j) => sum + j.payments[0].amount - j.payments[0].commission, 0);

    const completedCount = completed.length;
    const inProgressCount = inProgress.length;

    // CALCUL MENSUEL POUR GRAPH
    const revenueByMonth: Record<string, number> = {};
    const missionsByMonth: Record<string, number> = {};

    completed.forEach((job) => {
      const date = new Date(job.createdAt);
      const key = `${date.getFullYear()}-${date.getMonth() + 1}`;

      missionsByMonth[key] = (missionsByMonth[key] || 0) + 1;

      if (job.payments.length > 0) {
        const net = job.payments[0].amount - job.payments[0].commission;
        revenueByMonth[key] = (revenueByMonth[key] || 0) + net;
      }
    });

    // FORMAT GRAPH
    const graphData = Object.keys(missionsByMonth).map(key => ({
      month: key,
      missions: missionsByMonth[key] || 0,
      revenue: revenueByMonth[key] || 0,
    }));

    return NextResponse.json({
      jobs: {
        waiting,
        inProgress,
        completed,
      },
      stats: {
        totalEarned,
        completedCount,
        inProgressCount,
      },
      graph: graphData,
    });
  } catch (err) {
    console.error("API GO DASHBOARD ERROR :", err);
    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}
// API DASHBOARD GO - � REMPLACER
