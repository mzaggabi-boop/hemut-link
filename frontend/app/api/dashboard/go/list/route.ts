// frontend/app/api/dashboard/go/list/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { supabaseServer } from "@/lib/supabase-server";

export async function GET() {
  try {
    // AUTH
    const supabase = await supabaseServer(); // ✅ FIX : attendre le client Supabase

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      console.error("Supabase auth error:", authError);
      return NextResponse.json({ error: "Erreur d'authentification." }, { status: 401 });
    }

    if (!user) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "Utilisateur introuvable." }, { status: 404 });
    }

    const artisanId = dbUser.id;

    // RÉCUPÉRATION MISSIONS
    const jobs = await prisma.goJob.findMany({
      where: { artisanId },
      include: {
        payments: true,
        photos: true,
        client: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // CLASSEMENT
    const waiting = jobs.filter((j) => j.status === "ACCEPTED");
    const inProgress = jobs.filter((j) => j.status === "IN_PROGRESS");
    const completed = jobs.filter((j) => j.status === "COMPLETED");

    // STATISTIQUES GLOBALES
    const totalEarned = completed.reduce((sum, job) => {
      const p = job.payments[0];
      if (!p) return sum;
      return sum + (p.amount - p.commission);
    }, 0);

    const completedCount = completed.length;
    const inProgressCount = inProgress.length;

    // STATISTIQUES MENSUELLES
    const revenueByMonth: Record<string, number> = {};
    const missionsByMonth: Record<string, number> = {};

    completed.forEach((job) => {
      const date = new Date(job.createdAt);
      if (isNaN(date.getTime())) return;

      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}`;

      missionsByMonth[key] = (missionsByMonth[key] || 0) + 1;

      const p = job.payments[0];
      if (p) {
        const net = p.amount - p.commission;
        revenueByMonth[key] = (revenueByMonth[key] || 0) + net;
      }
    });

    // FORMAT GRAPH
    const graphData = Object.keys(missionsByMonth).map((key) => ({
      month: key,
      missions: missionsByMonth[key] || 0,
      revenue: revenueByMonth[key] || 0,
    }));

    return NextResponse.json({
      jobs: { waiting, inProgress, completed },
      stats: {
        totalEarned,
        completedCount,
        inProgressCount,
      },
      graph: graphData,
    });
  } catch (err) {
    console.error("API GO DASHBOARD ERROR :", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
