import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // ← obligatoire pour Vercel !!!
    const jobId = Number(id);

    if (Number.isNaN(jobId)) {
      return NextResponse.json(
        { error: "ID invalide." },
        { status: 400 }
      );
    }

    const job = await prisma.goJob.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return NextResponse.json(
        { error: "Job non trouvé." },
        { status: 404 }
      );
    }

    if (job.status === "CANCELLED") {
      return NextResponse.json(
        { error: "Ce job est déjà annulé." },
        { status: 400 }
      );
    }

    const updatedJob = await prisma.goJob.update({
      where: { id: jobId },
      data: {
        status: "CANCELLED",
        cancelledAt: new Date(),
      },
    });

    return NextResponse.json({
      ok: true,
      job: updatedJob,
    });
  } catch (error) {
    console.error("Erreur CANCEL:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Job non trouvé." },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}
