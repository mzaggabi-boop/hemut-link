// frontend/app/api/go/[id]/start/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  context: { params: { id: string } }   // ✅ Fix obligatoire Next16
) {
  try {
    const jobId = Number(context.params.id);

    if (Number.isNaN(jobId)) {
      return NextResponse.json(
        { error: "ID invalide." },
        { status: 400 }
      );
    }

    await prisma.goJob.update({
      where: { id: jobId },
      data: {
        status: "IN_PROGRESS",
        currentStep: "EN_ROUTE",
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erreur START:", error);
    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}
