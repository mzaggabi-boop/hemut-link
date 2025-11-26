// app/api/products/upload-image/route.ts
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { ok } from "assert";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const supabase = supabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Aucun fichier reçu" },
        { status: 400 }
      );
    }

    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}.${ext}`;
    const filePath = `${user.id}/${fileName}`;

    const { data: uploadData, error } = await supabase.storage
      .from("product-images")
      .upload(filePath, file, { upsert: true });

    if (error) {
      console.error(error);
      return NextResponse.json(
        { error: "Erreur upload Supabase" },
        { status: 500 }
      );
    }

    const publicUrl = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath).data.publicUrl;

    return NextResponse.json({ url: publicUrl });
  } catch (e) {
    console.error("UPLOAD IMAGE ERROR", e);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
