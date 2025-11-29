// app/dashboard/stats/page.tsx
import prisma from "@/lib/prisma";
import { supabaseServer } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import StatsCharts from "./StatsCharts";

type PaymentPoint = {
  date: string;
  gross: number;
  net: number;
};

export const dynamic = "force-dynamic";

export default async function StatsPage() {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="max-w-5xl mx-auto p-6">
        <p className="text-sm text-gray-600">Non authentifié.</p>
      </main>
    );
  }

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
  });

  if (!dbUser) return notFound();

  const payments = await prisma.payment.findMany({
    where: {
      receiverId: dbUser.id,
      status: "SUCCEEDED",
    },
    orderBy: { createdAt: "asc" },
  });

  const productsCount = await prisma.marketplaceProduct.count({
    where: { sellerId: dbUser.id },
  });

  const favoritesCount = await prisma.marketplaceFavorite.count({
    where: {
      product: {
        sellerId: dbUser.id,
      },
    },
  });

  const now = new Date();
  const days30Ago = new Date();
  days30Ago.setDate(now.getDate() - 30);

  let totalGross = 0;
  let totalNet = 0;
  let totalGross30 = 0;
  let totalNet30 = 0;
  const ordersSet = new Set<number>();

  const seriesMap: Record<string, PaymentPoint> = {};

  for (const p of payments) {
    const brut = p.amount;
    const net = p.amount - p.commission;
    totalGross += brut;
    totalNet += net;
    if (p.orderId) ordersSet.add(p.orderId);

    if (p.createdAt >= days30Ago) {
      totalGross30 += brut;
      totalNet30 += net;
    }

    const d = p.createdAt;
    const key = d.toISOString().slice(0, 10);

    if (!seriesMap[key]) {
      seriesMap[key] = {
        date: key,
        gross: 0,
        net: 0,
      };
    }
    seriesMap[key].gross += brut;
    seriesMap[key].net += net;
  }

  const chartData: PaymentPoint[] = Object.values(seriesMap).sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  const ordersCount = ordersSet.size;

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-gray-900">
          Statistiques vendeur
        </h1>
        <p className="text-sm text-gray-600">
          Vue d&apos;ensemble de vos ventes et de vos encaissements Hemut-link.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="CA brut total"
          value={totalGross}
          suffix="€"
          highlight
        />
        <StatCard label="CA net total" value={totalNet} suffix="€" />
        <StatCard
          label="CA net (30 derniers jours)"
          value={totalNet30}
          suffix="€"
        />
        <StatCard
          label="Commandes payées"
          value={ordersCount}
          suffix=""
          integer
        />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Produits en vente" value={productsCount} integer />
        <StatCard
          label="Favoris sur vos produits"
          value={favoritesCount}
          integer
        />
        <StatCard
          label="CA brut (30 derniers jours)"
          value={totalGross30}
          suffix="€"
        />
      </section>

      <section className="bg-white border rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Évolution de vos encaissements
          </h2>
          <p className="text-xs text-gray-500">
            Basé sur les paiements reçus (statut : SUCCEEDED)
          </p>
        </div>

        {chartData.length === 0 ? (
          <p className="text-sm text-gray-500">
            Vous n&apos;avez pas encore reçu de paiements.
          </p>
        ) : (
          <StatsCharts data={chartData} />
        )}
      </section>
    </main>
  );
}

function StatCard({
  label,
  value,
  suffix = "",
  highlight = false,
  integer = false,
}: {
  label: string;
  value: number;
  suffix?: string;
  highlight?: boolean;
  integer?: boolean;
}) {
  const displayValue = integer
    ? value.toLocaleString("fr-FR", { maximumFractionDigits: 0 })
    : value.toLocaleString("fr-FR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

  return (
    <div
      className={
        "rounded-xl border bg-white p-4 shadow-sm flex flex-col gap-1 " +
        (highlight ? "border-black" : "border-gray-200")
      }
    >
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-xl font-semibold text-gray-900">
        {displayValue}
        {suffix && <span className="text-sm text-gray-500 ml-1">{suffix}</span>}
      </p>
    </div>
  );
}
