// UPDATE PROFILE API - CODE � COLLER
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { supabaseServer } from "@/lib/supabase-server";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    const supabase = supabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: "Utilisateur introuvable" },
        { status: 404 }
      );
    }

    // --- VALIDATION ---
    if (body.siret && body.siret.length < 9) {
      return NextResponse.json(
        { error: "Le SIRET est invalide." },
        { status: 400 }
      );
    }

    // --- UPDATE USER ----
    await prisma.user.update({
      where: { id: dbUser.id },
      data: {
        phone: body.phone || null,
        companyName: body.companyName || null,
      },
    });

    // --- UPDATE BUSINESS PROFILE ---
    const existing = await prisma.businessProfile.findUnique({
      where: { userId: dbUser.id },
    });

    if (existing) {
      await prisma.businessProfile.update({
        where: { userId: dbUser.id },
        data: {
          siret: body.siret || null,
          address: body.address || null,
          zones: body.zones || null,
          certifications: body.certifications || null,
          insuranceDocs: body.insuranceDocs || null,
          description: body.description || null,
        },
      });
    } else {
      await prisma.businessProfile.create({
        data: {
          userId: dbUser.id,
          siret: body.siret || null,
          address: body.address || null,
          zones: body.zones || null,
          certifications: body.certifications || null,
          insuranceDocs: body.insuranceDocs || null,
          description: body.description || null,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("PROFILE UPDATE ERROR", e);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

