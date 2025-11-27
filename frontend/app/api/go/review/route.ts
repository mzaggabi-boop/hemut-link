import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { supabaseServer } from "@/lib/supabase-server";

export async function POST(req: Request) {
  const body = await req.json();
  const { jobId, rating, comment } = body;

  const supabase = supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
  });

  if (!dbUser) {
    return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
  }

  const job = await prisma.goJob.findUnique({
    where: { id: jobId },
  });

  if (!job) {
    return NextResponse.json({ error: "Mission introuvable" }, { status: 404 });
  }

  if (job.clientId !== dbUser.id) {
    return NextResponse.json(
      { error: "Seul le client peut poster un avis." },
      { status: 403 }
    );
  }

  if (!job.artisanId) {
    return NextResponse.json(
      { error: "Aucun artisan assigné à cette mission." },
      { status: 400 }
    );
  }

  await prisma.review.create({
    data: {
      rating,
      comment: comment || "",
      userId: job.clientId,
      artisanId: job.artisanId,
    },
  });

  return NextResponse.json({ success: true }, { status: 200 });
}

