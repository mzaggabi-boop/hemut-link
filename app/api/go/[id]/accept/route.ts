// app/api/go/[id]/accept/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { supabaseServer } from "@/lib/supabase-server";

export async function POST(
  req: Request,
  context: { params: { id: string } }
) {
  const jobId = parseInt(context.params.id);

  if (isNaN(jobId)) {
    return NextResponse.json({ error: "ID invalide." }, { status: 400 });
  }

  // AUTH
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
    return NextResponse.json({ error: "Utilisateur introuvable." }, { status: 404 });
  }

  // RÉCUPÉRER MISSION
  const job = await prisma.goJob.findUnique({
    where: { id: jobId },
  });

  if (!job) {
    return NextResponse.json({ error: "Mission introuvable." }, { status: 404 });
  }

  // DÉJÀ PRISE ?
  if (job.artisanId !== null) {
    return NextResponse.json(
      { error: "Cette mission a déjà été acceptée par un autre artisan." },
      { status: 400 }
    );
  }

  // L’UTILISATEUR NE DOIT PAS ÊTRE LE CLIENT
  if (job.clientId === dbUser.id) {
    return NextResponse.json(
      { error: "Vous ne pouvez pas accepter votre propre mission." },
      { status: 400 }
    );
  }

  // ASSIGNATION ARTISAN
  await prisma.goJob.update({
    where: { id: jobId },
    data: {
      artisanId: dbUser.id,
      status: "ACCEPTED",
    },
  });

  return NextResponse.json(
    { success: true, message: "Mission acceptée avec succès !" },
    { status: 200 }
  );
}
