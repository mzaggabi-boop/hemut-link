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
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
      include: { businessProfile: true },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    return NextResponse.json({
      email: dbUser.email,
      phone: dbUser.phone,
      companyName: dbUser.companyName,
      businessProfile: dbUser.businessProfile,
    });
  } catch (error) {
    console.error("GET PROFILE ERROR", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
