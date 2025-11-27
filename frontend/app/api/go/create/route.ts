// app/api/go/create/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { supabaseServer } from "@/lib/supabase-server";

// 🗺️ Géocodage OpenStreetMap
async function geocodeAddress(address: string) {
  try {
    const url =
      "https://nominatim.openstreetmap.org/search?format=json&q=" +
      encodeURIComponent(address);

    const res = await fetch(url);
    const json = await res.json();

    if (!json || json.length === 0) return null;

    return {
      lat: parseFloat(json[0].lat),
      lon: parseFloat(json[0].lon),
    };
  } catch {
    return null;
  }
}

// 🔵 Distance Haversine (km)
function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const title = (formData.get("title") as string)?.trim();
    const description = (formData.get("description") as string)?.trim();
    const address = (formData.get("address") as string)?.trim();
    const budgetRaw = (formData.get("budget") as string)?.trim();
    const budget = budgetRaw ? parseFloat(budgetRaw) : null;

    if (!title || !address) {
      return NextResponse.json(
        { error: "Titre et adresse obligatoires." },
        { status: 400 }
      );
    }

    // AUTH
    const supabase = supabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user)
      return NextResponse.json(
        { error: "Non authentifié." },
        { status: 401 }
      );

    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
    });

    if (!dbUser)
      return NextResponse.json(
        { error: "Utilisateur introuvable." },
        { status: 404 }
      );

    // 🔎 GEOCODAGE
    const geo = await geocodeAddress(address);

    // 🟦 INSERTION mission
    const job = await prisma.goJob.create({
      data: {
        title,
        description: description || "",
        address,
        latitude: geo?.lat || null,
        longitude: geo?.lon || null,
        price: budget,
        clientId: dbUser.id,
      },
    });

    // 🖼️ PHOTOS
    const photos = formData.getAll("photos") as File[];
    for (const file of photos) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      await prisma.jobPhoto.create({
        data: {
          jobId: job.id,
          url: `data:${file.type};base64,${buffer.toString("base64")}`,
        },
      });
    }

    // ============================================================
    // 🟣 D1 — NOTIFIER ARTISANS PROCHES DE LA MISSION
    // ============================================================

    if (geo) {
      const radiusKm = 10; // rayon configurable

      const artisans = await prisma.user.findMany({
        where: {
          role: "ARTISAN",
          // exclut le client
          NOT: { id: dbUser.id },
        },
        include: { businessProfile: true },
        take: 200,
      });

      const nearby = artisans.filter(
        (artisan) =>
          artisan.businessProfile &&
          artisan.businessProfile.zones && // zone = lat,lon ?
          (() => {
            const [latStr, lonStr] =
              artisan.businessProfile.zones.split(",") || [];
            const lat = parseFloat(latStr);
            const lon = parseFloat(lonStr);
            if (isNaN(lat) || isNaN(lon)) return false;
            const d = haversine(geo.lat, geo.lon, lat, lon);
            return d <= radiusKm;
          })()
      );

      // 🔔 Création notification interne
      for (const art of nearby) {
        await prisma.notification.create({
          data: {
            userId: art.id,
            message: `Nouvelle mission GO à proximité : ${title}`,
            url: `/go/${job.id}`,
          },
        });
      }

      // ============================================================
      // 🟣 D2 — MESSAGE AUTOMATIQUE
      // ============================================================

      for (const art of nearby) {
        // création conversation
        const convo = await prisma.conversation.create({
          data: {},
        });

        await prisma.message.create({
          data: {
            conversationId: convo.id,
            senderId: dbUser.id, // client
            receiverId: art.id,
            content: `Bonjour, une nouvelle mission est disponible près de vous : "${title}".`,
          },
        });
      }
    }

    return NextResponse.json({ id: job.id }, { status: 200 });
  } catch (err: any) {
    console.error("GO CREATE ERROR:", err);
    return NextResponse.json(
      { error: "Erreur serveur lors de la création." },
      { status: 500 }
    );
  }
}

