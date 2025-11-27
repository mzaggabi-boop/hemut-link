// UPLOAD FILE API - CODE � COLLER
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import prisma from "@/lib/prisma";

export const runtime = "edge";

export async function POST(req: Request) {
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
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: "Utilisateur introuvable" },
        { status: 404 }
      );
    }

    // --- RÉCEPTION DU FORM DATA ---
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const type = formData.get("type") as string;

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier reçu" }, { status: 400 });
    }

    if (!type) {
      return NextResponse.json(
        { error: "Type de document requis" },
        { status: 400 }
      );
    }

    // --- NOM DE FICHIER ---
    const ext = file.name.split(".").pop();
    const filePath = `${dbUser.id}/${type}.${ext}`;

    // --- UPLOAD SUPABASE STORAGE ---
    const { data: uploadData, error: uploadError } =
      await supabase.storage
        .from("business-docs")
        .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error(uploadError);
      return NextResponse.json(
        { error: "Erreur upload Supabase" },
        { status: 500 }
      );
    }

    const publicUrl = supabase.storage
      .from("business-docs")
      .getPublicUrl(filePath).data.publicUrl;

    // --- UPDATE PRISMA ---
    const fieldMap: Record<string, string> = {
      certification: "certifications",
      insurance: "insuranceDocs",
      logo: "companyName", // (on mettra un champ logo dans ton Prisma si tu veux)
      document: "insuranceDocs",
    };

    const fieldToUpdate = fieldMap[type] || type;

    await prisma.businessProfile.update({
      where: { userId: dbUser.id },
      data: {
        [fieldToUpdate]: publicUrl,
      },
    });

    return NextResponse.json({
      success: true,
      url: publicUrl,
    });
  } catch (e) {
    console.error("UPLOAD ERROR", e);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

