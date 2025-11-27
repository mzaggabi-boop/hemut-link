// frontend/app/api/go/[id]/pay/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import Stripe from "stripe";
import { supabaseServer } from "@/lib/supabase-server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(
  request: NextRequest,
  context: { params: { id: string } }   // ✅ FIX Next.js 16
) {
  try {
    const jobId = Number(context.params.id);

    if (Number.isNaN(jobId)) {
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
      return NextResponse.json(
        { error: "Utilisateur inconnu." },
        { status: 404 }
      );
    }

    // RÉCUPÉRER MISSION
    const job = await prisma.goJob.findUnique({
      where: { id: jobId },
      include: { client: true, artisan: true },
    });

    if (!job) {
      return NextResponse.json(
        { error: "Mission introuvable." },
        { status: 404 }
      );
    }

    // Vérifier que l'utilisateur est le client
    if (job.clientId !== dbUser.id) {
      return NextResponse.json(
        { error: "Vous n'êtes pas le client de cette mission." },
        { status: 403 }
      );
    }

    // Vérifier qu'un artisan a accepté la mission
    if (!job.artisanId) {
      return NextResponse.json(
        { error: "La mission doit être acceptée avant paiement." },
        { status: 400 }
      );
    }

    // Vérifier le prix
    if (!job.price) {
      return NextResponse.json(
        { error: "Aucun montant défini pour cette mission." },
        { status: 400 }
      );
    }

    const amount = Math.round(job.price * 100);

    // CRÉATION PAYMENT INTENT
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "eur",
      metadata: {
        goJobId: job.id.toString(),
        clientId: job.clientId.toString(),
        artisanId: job.artisanId.toString(),
      },
    });

    // Sauvegarde en base
    await prisma.payment.create({
      data: {
        jobId: job.id,
        senderId: job.clientId,
        receiverId: job.artisanId,
        amount: job.price,
        commission: job.price * 0.1,
        stripePaymentIntentId: paymentIntent.id,
        status: "PENDING",
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (err) {
    console.error("GO PAYMENT ERROR:", err);
    return NextResponse.json(
      { error: "Erreur lors de la création du paiement." },
      { status: 500 }
    );
  }
}

