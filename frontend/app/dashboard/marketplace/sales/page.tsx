import prisma from "@/lib/prisma";
import { supabaseServer } from "@/lib/supabase-server";
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

function statusLabel(status: string | null) {
  switch (status) {
    case "pending":
      return "En attente de paiement";
    case "paid":
      return "Payée";
    case "canceled":
      return "Annulée";
    default:
      return status || "Inconnu";
  }
}

export default async function MarketplaceSalesPage() {
  // ----------------------------
  // 🔒 AUTH FIX
  // ----------------------------
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-6">
        <p className="text-sm text-red-600">Vous devez être connecté.</p>
      </main>
    );
  }

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
  });

  if (!dbUser) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-6">
        <p className="text-sm text-red-600">Utilisateur introuvable.</p>
      </main>
    );
  }

  // ----------------------------
  // 📦 RÉCUPÉRATION DES VENTES
  // ----------------------------
  const sales = await prisma.marketplaceOrder.findMany({
    where: { sellerId: dbUser.id },
    include: {
      product: true,
      buyer: true,
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  const totalRevenue = sales
    .filter((s) => s.status === "paid")
    .reduce((sum, s) => sum + s.total, 0);

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">
      {/* HEADER */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Mes ventes marketplace
          </h1>
          <p className="text-sm text-gray-600">Historique de vos ventes.</p>
        </div>

        <div className="text-right">
          <p className="text-xs text-gray-500">Revenu total (ventes payées)</p>
          <p className="text-lg font-semibold text-gray-900">
            {totalRevenue.toLocaleString("fr-FR", {
              style: "currency",
              currency: "EUR",
            })}
          </p>
        </div>
      </header>

      {/* Aucune vente */}
      {sales.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-500">
          Vous n’avez encore réalisé aucune vente sur la marketplace.
        </div>
      ) : (
        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">
              Liste des ventes ({sales.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Produit</th>
                  <th className="px-4 py-2 text-left">Acheteur</th>
                  <th className="px-4 py-2 text-right">Montant</th>
                  <th className="px-4 py-2 text-left">Statut</th>
                  <th className="px-4 py-2 text-left">Stripe</th>
                  <th className="px-4 py-2 text-left">Chat</th>
                </tr>
              </thead>

              <tbody>
                {sales.map((s) => (
                  <tr
                    key={s.id}
                    className="border-t border-gray-100 hover:bg-gray-50/50"
                  >
                    <td className="px-4 py-2 text-xs text-gray-600 whitespace-nowrap">
                      {formatDate(s.createdAt)}
                    </td>

                    <td className="px-4 py-2">
                      <span className="text-sm font-medium text-gray-900">
                        {s.product?.title || "Produit supprimé"}
                      </span>
                      <div className="text-[11px] text-gray-500">
                        Vente #{s.id}
                      </div>
                    </td>

                    <td className="px-4 py-2 text-xs text-gray-700">
                      {s.buyer ? (
                        <>
                          <div className="font-medium">
                            {s.buyer.firstname} {s.buyer.lastname}
                          </div>
                          <div className="text-[11px] text-gray-500">
                            {s.buyer.email}
                          </div>
                        </>
                      ) : (
                        <span className="text-gray-400">Acheteur introuvable</span>
                      )}
                    </td>

                    <td className="px-4 py-2 text-right font-semibold text-gray-900">
                      {s.total.toLocaleString("fr-FR", {
                        style: "currency",
                        currency: s.currency || "EUR",
                      })}
                    </td>

                    <td className="px-4 py-2 text-xs">
                      <span
                        className={
                          "inline-flex items-center rounded-full px-2 py-1 text-[11px] font-medium " +
                          (s.status === "paid"
                            ? "bg-emerald-50 text-emerald-700"
                            : s.status === "canceled"
                            ? "bg-red-50 text-red-700"
                            : "bg-amber-50 text-amber-700")
                        }
                      >
                        {statusLabel(s.status)}
                      </span>
                    </td>

                    <td className="px-4 py-2 text-xs text-gray-600">
                      {s.stripePaymentStatus || "—"}
                      {s.stripeCheckoutSessionId && (
                        <div className="mt-1">
                          <Link
                            href={`https://dashboard.stripe.com/test/checkout/sessions/${s.stripeCheckoutSessionId}`}
                            target="_blank"
                            className="text-[11px] text-blue-600 underline"
                          >
                            Voir dans Stripe
                          </Link>
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-2 text-xs">
                      <Link
                        href={`/dashboard/marketplace/sales/${s.id}/chat`}
                        className="text-blue-600 underline text-xs"
                      >
                        Ouvrir le chat
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
}
