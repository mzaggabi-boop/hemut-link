import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  req: Request,
  context: { params: { id: string } }
) {
  const id = Number(context.params.id);
  const data = await req.json();

  const { trackingNumber, carrier } = data;

  if (!trackingNumber || !carrier) {
    return NextResponse.json(
      { error: "Numéro de suivi et transporteur obligatoires." },
      { status: 400 }
    );
  }

  // Génération automatique d'un lien de tracking
  function trackingLink(carrier: string, number: string) {
    switch (carrier.toLowerCase()) {
      case "colissimo":
        return `https://www.laposte.fr/outils/suivre-vos-envois?code=${number}`;
      case "chronopost":
        return `https://www.chronopost.fr/fr/suivi-colis?numero=${number}`;
      case "ups":
        return `https://www.ups.com/track?loc=fr_FR&tracknum=${number}`;
      case "dhl":
        return `https://www.dhl.com/fr-fr/home/suivi.html?tracking-id=${number}`;
      default:
        return null; // transporteur personnalisé
    }
  }

  const url = trackingLink(carrier, trackingNumber);

  const order = await prisma.marketplaceOrder.update({
    where: { id },
    data: {
      trackingNumber,
      carrier,
      trackingUrl: url,
      shippedAt: new Date(),
      status: "shipped",
    },
  });

  return NextResponse.json({ success: true, order });
}

