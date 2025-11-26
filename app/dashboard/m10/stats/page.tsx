// app/dashboard/m10/stats/page.tsx
import prisma from "@/lib/prisma";
import Link from "next/link";

function formatCurrency(value: number) {
  return value.toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
  });
}

function formatNumber(n: number) {
  return n.toLocaleString("fr-FR");
}

export default async function StatsPage() {
  // 1) STATISTIQUES MARKETPLACE
  const [
    totalSales,
    totalRevenue,
    bestProducts,
    sellerRanking,
    goJobsByArtisan,
  ] = await Promise.all([
    prisma.marketplaceOrder.count({
      where: { status: { in: ["paid", "delivered"] } },
    }),

    prisma.marketplaceOrder.aggregate({
      _sum: { total: true },
      where: { status: { in: ["paid", "delivered"] } },
    }),

    prisma.marketplaceOrder.groupBy({
      by: ["productId"],
      _count: { productId: true },
      orderBy: { _count: { productId: "desc" } },
      take: 5,
    }),

    prisma.marketplaceOrder.groupBy({
      by: ["sellerId"],
      _count: { sellerId: true },
      orderBy: { _count: { sellerId: "desc" } },
      take: 5,
    }),

    prisma.goJob.groupBy({
      by: ["artisanId"],
      _count: { artisanId: true },
      orderBy: { _count: { artisanId: "desc" } },
      take: 5,
    }),
  ]);

  const products = await prisma.product.findMany({
    where: {
      id: { in: bestProducts.map((p) => p.productId).filter(Boolean) },
    },
  });

  const sellers = await prisma.user.findMany({
    where: {
      id: { in: sellerRanking.map((s) => s.sellerId).filter(Boolean) },
    },
  });

  const artisans = await prisma.user.findMany({
    where: {
      id: { in: goJobsByArtisan.map((g) => g.artisanId).filter(Boolean) },
    },
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">
      {/* HEADER */}
      <header className="flex flex-col gap-2 border-b border-gray-100 pb-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Statistiques vendeur (M10)
          </h1>
          <p className="text-xs text-gray-600">
            Données consolidées de performance Marketplace & missions GO.
          </p>
        </div>
      </header>

      {/* KPI */}
      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">Ventes Marketplace</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {formatNumber(totalSales)}
          </p>
          <p className="mt-1 text-[11px] text-gray-500">
            Total des ventes payées/livrées.
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">Revenus générés</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {formatCurrency(totalRevenue._sum.total ?? 0)}
          </p>
          <p className="mt-1 text-[11px] text-gray-500">Montant brut total.</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">Missions GO complétées</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {goJobsByArtisan.reduce((acc, g) => acc + g._count.artisanId, 0)}
          </p>
          <p className="mt-1 text-[11px] text-gray-500">
            Par les artisans actifs.
          </p>
        </div>
      </section>

      {/* PRODUITS LES PLUS VENDUS */}
      <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-4">
        <h2 className="text-sm font-semibold text-gray-900">
          Produits les plus vendus
        </h2>

        {bestProducts.length === 0 ? (
          <p className="text-xs text-gray-500">Aucune vente enregistrée.</p>
        ) : (
          <ul className="divide-y divide-gray-100 text-xs">
            {bestProducts.map((p) => {
              const product = products.find((prod) => prod.id === p.productId);
              return (
                <li
                  key={p.productId}
                  className="flex items-center justify-between py-2"
                >
                  <p className="font-medium text-gray-900">
                    {product?.title ?? "Produit supprimé"}
                  </p>
                  <span className="text-gray-700">
                    {p._count.productId} ventes
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* CLASSEMENT DES VENDEURS */}
      <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-4">
        <h2 className="text-sm font-semibold text-gray-900">Top vendeurs</h2>

        {sellerRanking.length === 0 ? (
          <p className="text-xs text-gray-500">Aucun vendeur encore actif.</p>
        ) : (
          <ul className="divide-y divide-gray-100 text-xs">
            {sellerRanking.map((s) => {
              const seller = sellers.find((u) => u.id === s.sellerId);
              return (
                <li key={s.sellerId} className="flex justify-between py-2">
                  <span className="font-medium text-gray-900">
                    {seller
                      ? `${seller.firstname ?? ""} ${seller.lastname ?? ""}`
                      : "Utilisateur supprimé"}
                  </span>
                  <span>{s._count.sellerId} ventes</span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* PERFORMANCE ARTISANS GO */}
      <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-4">
        <h2 className="text-sm font-semibold text-gray-900">
          Performance artisans (missions GO)
        </h2>

        {goJobsByArtisan.length === 0 ? (
          <p className="text-xs text-gray-500">Aucune mission enregistrée.</p>
        ) : (
          <ul className="divide-y divide-gray-100 text-xs">
            {goJobsByArtisan.map((g) => {
              const artisan = artisans.find((u) => u.id === g.artisanId);
              return (
                <li key={g.artisanId} className="flex justify-between py-2">
                  <span className="font-medium text-gray-900">
                    {artisan
                      ? `${artisan.firstname ?? ""} ${artisan.lastname ?? ""}`
                      : "Artisan supprimé"}
                  </span>
                  <span>{g._count.artisanId} missions</span>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
