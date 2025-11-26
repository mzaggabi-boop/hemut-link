// app/dashboard/marketplace/sales/page.tsx
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";

function formatCurrency(value: number) {
  return value.toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
  });
}

function formatDate(date: Date) {
  return date.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function SalesPage() {
  const user = await getCurrentUser();
  if (!user) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-6">
        <p className="text-sm text-gray-600">
          Vous devez être connecté pour voir vos ventes.
        </p>
      </main>
    );
  }

  const sales = await prisma.marketplaceOrder.findMany({
    where: {
      sellerId: user.id,
    },
    orderBy: { createdAt: "desc" },
    include: {
      product: true,
      buyer: true,
    },
  });

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 space-y-6">
      {/* HEADER */}
      <header className="border-b pb-4 flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-gray-900">
          Mes ventes Marketplace
        </h1>
        <p className="text-xs text-gray-600">
          Liste des commandes reçues sur vos produits publiés dans Hemut-link.
        </p>
      </header>

      {/* LISTE */}
      <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-4">
        <h2 className="text-sm font-semibold text-gray-900">
          Commandes reçues
        </h2>

        {sales.length === 0 ? (
          <p className="text-xs text-gray-500">
            Vous n’avez encore aucune vente pour le moment.
          </p>
        ) : (
          <ul className="divide-y divide-gray-100 text-xs">
            {sales.map((order) => (
              <li
                key={order.id}
                className="flex items-center justify-between gap-3 py-3"
              >
                <div className="min-w-0 flex-1 space-y-0.5">
                  <p className="font-medium text-gray-900">
                    Commande #{order.id} —{" "}
                    {order.product?.title ?? "Produit supprimé"}
                  </p>

                  <p className="text-[11px] text-gray-500">
                    Reçue le {formatDate(order.createdAt)}
                    {order.buyer && (
                      <>
                        {" "}
                        • Acheteur{" "}
                        <span className="font-medium text-gray-800">
                          {order.buyer.firstname} {order.buyer.lastname}
                        </span>
                      </>
                    )}
                  </p>

                  <p className="text-[11px] text-gray-700 font-semibold">
                    Total :{" "}
                    {order.total
                      ? formatCurrency(order.total)
                      : "Montant inconnu"}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <Link
                    href={`/dashboard/orders/${order.id}`}
                    className="text-[11px] font-medium text-indigo-600 hover:underline"
                  >
                    Voir la commande →
                  </Link>

                  <Link
                    href={`/dashboard/marketplace/sales/${order.id}/chat`}
                    className="text-[11px] font-medium text-gray-700 hover:underline"
                  >
                    Ouvrir le chat →
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
