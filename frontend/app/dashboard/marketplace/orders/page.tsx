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

export default async function SellerMarketplaceOrdersPage() {
  const supabase = supabaseServer();
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
        <p className="text-sm text-red-600">
          Utilisateur introuvable dans la base de données.
        </p>
      </main>
    );
  }

  const orders = await prisma.marketplaceOrder.findMany({
    where: { sellerId: dbUser.id },
    include: {
      product: true,
      buyer: true,
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const totalPaid = orders
    .filter((o) => o.status === "paid")
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">
      {/* HEADER */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Commandes marketplace reçues
          </h1>
          <p className="text-sm text-gray-600">
            Suivi des ventes réalisées via la marketplace Hemut-link.
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs text-gray-500">Total encaissé (commandes payées)</p>
          <p className="text-lg font-semibold text-gray-900">
            {totalPaid.toLocaleString("fr-FR", {
              style: "currency",
              currency: "EUR",
            })}
          </p>
        </div>
      </header>

      {/* AUCUNE COMMANDE */}
      {orders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-500">
          Vous n&apos;avez pas encore reçu de commande via la marketplace.
          <br />
          <span className="text-xs text-gray-400">
            Vos produits apparaîtront ici dès qu&apos;un client passera commande.
          </span>
        </div>
      ) : (
        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">
              Liste des commandes ({orders.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Produit</th>
                  <th className="px-4 py-2 text-left">Client</th>
                  <th className="px-4 py-2 text-right">Montant</th>
                  <th className="px-4 py-2 text-left">Statut</th>
                  <th className="px-4 py-2 text-left">Stripe</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr
                    key={o.id}
                    className="border-t border-gray-100 hover:bg-gray-50/50"
                  >
                    <td className="px-4 py-2 align-top text-xs text-gray-600 whitespace-nowrap">
                      {formatDate(o.createdAt)}
                    </td>

                    <td className="px-4 py-2 align-top">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900 line-clamp-1">
                          {o.product?.title || "Produit supprimé"}
                        </span>
                        <span className="text-[11px] text-gray-400">
                          ID commande #{o.id}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-2 align-top text-xs text-gray-700">
                      {o.buyer ? (
                        <>
                          <div className="font-medium">
                            {o.buyer.firstname} {o.buyer.lastname}
                          </div>
                          <div className="text-[11px] text-gray-500">
                            {o.buyer.email}
                          </div>
                        </>
                      ) : (
                        <span className="text-gray-400">Client introuvable</span>
                      )}
                    </td>

                    <td className="px-4 py-2 align-top text-right text-sm font-semibold text-gray-900">
                      {o.total.toLocaleString("fr-FR", {
                        style: "currency",
                        currency: o.currency || "EUR",
                      })}
                    </td>

                    <td className="px-4 py-2 align-top text-xs">
                      <span
                        className={
                          "inline-flex items-center rounded-full px-2 py-1 text-[11px] font-medium " +
                          (o.status === "paid"
                            ? "bg-emerald-50 text-emerald-700"
                            : o.status === "canceled"
                            ? "bg-red-50 text-red-700"
                            : "bg-amber-50 text-amber-700")
                        }
                      >
                        {statusLabel(o.status)}
                      </span>
                    </td>

                    <td className="px-4 py-2 align-top text-xs text-gray-600">
                      {o.stripePaymentStatus || "—"}
                      {o.stripeCheckoutSessionId && (
                        <div className="mt-1">
                          <Link
                            href={`https://dashboard.stripe.com/test/checkout/sessions/${o.stripeCheckoutSessionId}`}
                            target="_blank"
                            className="text-[11px] text-blue-600 underline"
                          >
                            Voir dans Stripe
                          </Link>
                        </div>
                      )}
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
