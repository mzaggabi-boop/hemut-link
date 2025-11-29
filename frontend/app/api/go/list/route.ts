// app/api/go/list/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Calcul distance Haversine en kilomètres
function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // rayon terre en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const lat = parseFloat(url.searchParams.get("lat") || "0");
    const lon = parseFloat(url.searchParams.get("lon") || "0");
    const max = parseFloat(url.searchParams.get("max") || "20");

    if (!lat || !lon) {
      return NextResponse.json(
        { error: "Position GPS invalide." },
        { status: 400 }
      );
    }

    const jobs = await prisma.goJob.findMany({
      where: {
        artisanId: null,
      },
      include: {
        photos: { take: 1 },
        client: true,
        artisan: {
          include: {
            reviewsReceived: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    const result = jobs
      .map((job) => {
        if (job.latitude == null || job.longitude == null) return null;

        const distanceKm = haversine(lat, lon, job.latitude, job.longitude);

        if (distanceKm > max) return null;

        let rating = null;
        let reviewsCount = 0;

        if (job.artisan && job.artisan.reviewsReceived.length > 0) {
          const sum = job.artisan.reviewsReceived.reduce(
            (acc, r) => acc + r.rating,
            0
          );
          reviewsCount = job.artisan.reviewsReceived.length;
          rating = sum / reviewsCount;
        }

        return {
          ...job,
          distanceKm,
          artisanRating: rating,
          artisanReviewsCount: reviewsCount,
        };
      })
      .filter(Boolean)
      .sort((a: any, b: any) => a.distanceKm - b.distanceKm);

    return NextResponse.json({ jobs: result }, { status: 200 });
  } catch (err) {
    console.error("GO LIST ERROR:", err);
    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}

