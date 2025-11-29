// app/dashboard/m10/litige/page.tsx
export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import Link from "next/link";

function formatDate(date: Date) {
  return date.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function LitigeListPage() {
  const disputes = await prisma.marketplaceOrder.findMany({
    where: { status: "dispute" },
    include: {
      buyer: true,
      seller: true,
      product: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">
      <header className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Litiges Marketplace (M10)
          </h1>
          <p className="text-xs text-gray-600">
            Suivi des litiges entre acheteurs et vendeurs sur Hemut-link.
          </p>
        </div>
      </header>

      {disputes.length === 0 ? (
        <p className="text-sm text-gray-500">Aucun litige pour le moment.</p>
      ) : (
        <ul className="divide-y divide-gray-100 text-sm">
          {disputes.map((d) => (
            <li
              key={d.id}
              className="flex items-center justify-between gap-4 py-3"
            >
              <div className="flex-1">
                <p className="font-medium text-gray-900">
                  Litige sur commande #{d.id} —{" "}
                  <span className="text-gray-700">
                    {d.product?.title ?? "Produit supprimé"}
                  </span>
                </p>
                <p className="text-xs text-gray-600">
                  Dernière mise à jour : {formatDate(d.updatedAt)}
                </p>
                <p className="text-xs text-gray-500">
                  Acheteur : {d.buyer?.firstname} {d.buyer?.lastname} • Vendeur :{" "}
                  {d.seller?.firstname} {d.seller?.lastname}
                </p>
              </div>
              <Link
                href={`/dashboard/m10/litige/${d.id}`}
                className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700"
              >
                Ouvrir →
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
