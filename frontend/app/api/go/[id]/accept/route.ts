// app/api/go/[id]/accept/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { supabaseServer } from "@/lib/supabase-server";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const jobId = Number(id);

    if (Number.isNaN(jobId)) {
      return NextResponse.json(
        { error: "ID invalide." },
        { status: 400 }
      );
    }

    const supabase = supabaseServer();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Non authentifié." },
        { status: 401 }
      );
    }

    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: "Utilisateur introuvable." },
        { status: 404 }
      );
    }

    // Accepter la mission
    await prisma.goJob.update({
      where: { id: jobId },
      data: {
        artisanId: dbUser.id,
        status: "ACCEPTED",
      },
    });

    return NextResponse.json(
      { success: true, message: "Mission acceptée." },
      { status: 200 }
    );

  } catch (err) {
    console.error("GO ACCEPT ERROR:", err);
    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}
