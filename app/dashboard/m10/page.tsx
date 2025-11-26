// app/dashboard/m10/page.tsx
import Link from "next/link";
import prisma from "@/lib/prisma";

type OrderStatus = string;
type GoJobStatus = string;

function formatOrderStatusLabel(status: OrderStatus) {
  if (!status) return "Inconnu";

  switch (status) {
    case "pending":
    case "PENDING":
      return "En attente";
    case "paid":
    case "PAID":
      return "Payée";
    case "shipped":
    case "SHIPPED":
      return "Expédiée";
    case "delivered":
    case "DELIVERED":
      return "Livrée";
    case "cancelled":
    case "CANCELLED":
      return "Annulée";
    default:
      return status;
  }
}

function formatGoJobStatusLabel(status: GoJobStatus) {
  if (!status) return "Inconnu";

  switch (status) {
    case "PENDING":
      return "En attente";
    case "ACCEPTED":
      return "Acceptée";
    case "IN_PROGRESS":
      return "En cours";
    case "COMPLETED":
      return "Terminée";
    case "CANCELLED":
      return "Annulée";
    default:
      return status;
  }
}

function getGoStatusBadgeClass(status: GoJobStatus) {
  switch (status) {
    case "PENDING":
      return "bg-amber-50 text-amber-800 border-amber-200";
    case "ACCEPTED":
      return "bg-blue-50 text-blue-800 border-blue-200";
    case "IN_PROGRESS":
      return "bg-sky-50 text-sky-800 border-sky-200";
    case "COMPLETED":
      return "bg-emerald-50 text-emerald-800 border-emerald-200";
    case "CANCELLED":
      return "bg-rose-50 text-rose-800 border-rose-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
}

function formatDateTime(date: Date) {
  return date.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type DashboardData = {
  totalOrders: number;
  totalGoJobs: number;
  recentOrders: {
    id: number;
    createdAt: Date;
    status: string;
    total: number | null;
    buyer?: { firstname: string | null; lastname: string | null } | null;
    seller?: { firstname: string | null; lastname: string | null } | null;
    product?: { title: string | null } | null;
  }[];
  recentGoJobs: {
    id: number;
    title: string;
    createdAt: Date;
    status: string;
    address: string | null;
    client?: { firstname: string | null; lastname: string | null } | null;
    artisan?: { firstname: string | null; lastname: string | null } | null;
  }[];
};

async function getDashboardData(): Promise<DashboardData> {
  const [totalOrders, totalGoJobs, recentOrders, recentGoJobs] =
    await Promise.all([
      prisma.marketplaceOrder.count(),
      prisma.goJob.count(),
      prisma.marketplaceOrder.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          buyer: true,
          seller: true,
          product: true,
        },
      }),
      prisma.goJob.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          client: true,
          artisan: true,
        },
      }),
    ]);

  return {
    totalOrders,
    totalGoJobs,
    recentOrders: recentOrders.map((order) => ({
      id: order.id,
      createdAt: order.createdAt,
      status: order.status as string,
      total: (order as any).total ?? null,
      buyer: order.buyer
        ? {
            firstname: order.buyer.firstname ?? null,
            lastname: order.buyer.lastname ?? null,
          }
        : null,
      seller: order.seller
        ? {
            firstname: order.seller.firstname ?? null,
            lastname: order.seller.lastname ?? null,
          }
        : null,
      product: order.product
        ? {
            title: order.product.title ?? null,
          }
        : null,
    })),
    recentGoJobs: recentGoJobs.map((job) => ({
      id: job.id,
      title: job.title,
      createdAt: job.createdAt,
      status: job.status as string,
      address: job.address ?? null,
      client: job.client
        ? {
            firstname: job.client.firstname ?? null,
            lastname: job.client.lastname ?? null,
          }
        : null,
      artisan: job.artisan
        ? {
            firstname: job.artisan.firstname ?? null,
            lastname: job.artisan.lastname ?? null,
          }
        : null,
    })),
  };
}

export default async function M10DashboardPage() {
  const data = await getDashboardData();

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">
      {/* HEADER */}
      <header className="flex flex-col gap-2 border-b border-gray-100 pb-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            M10 — Gestion des commandes
          </h1>
          <p className="text-xs text-gray-600">
            Vue d&apos;ensemble des commandes Marketplace et des missions GO,
            point d&apos;entrée vers les litiges, statistiques, calendrier et
            recherche avancée.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <Link href="/dashboard/m10/litige" className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-3 py-1 font-medium text-rose-800 hover:bg-rose-100">
            Litiges commandes
          </Link>
          <Link href="/dashboard/m10/stats" className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 font-medium text-emerald-800 hover:bg-emerald-100">
            Statistiques vendeur
          </Link>
          <Link href="/dashboard/m10/calendrier" className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-3 py-1 font-medium text-sky-800 hover:bg-sky-100">
            Calendrier interventions
          </Link>
          <Link href="/dashboard/m10/search" className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 font-medium text-indigo-800 hover:bg-indigo-100">
            Search Marketplace
          </Link>
        </div>
      </header>

      {/* GRILLE PRINCIPALE */}
      <div className="grid gap-6 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1.7fr)]">
        {/* COLONNE GAUCHE : KPIs */}
        <section className="space-y-4">
          {/* CARTES KPIs */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium text-gray-500">
                Commandes Marketplace (toutes)
              </p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">
                {data.totalOrders}
              </p>
              <p className="mt-1 text-[11px] text-gray-500">
                Inclut toutes les commandes.
              </p>
              <Link href="/dashboard/orders" className="mt-3 inline-flex text-xs font-medium text-indigo-600 hover:underline">
                Voir les commandes →
              </Link>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium text-gray-500">
                Missions GO (toutes)
              </p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">
                {data.totalGoJobs}
              </p>
              <p className="mt-1 text-[11px] text-gray-500">
                Missions créées via Hemut-link GO.
              </p>
              <Link href="/dashboard/go" className="mt-3 inline-flex text-xs font-medium text-indigo-600 hover:underline">
                Voir missions GO →
              </Link>
            </div>
          </div>

          {/* TEXTE EXPLICATIF */}
          <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4 text-[11px] text-gray-600">
            <p className="font-semibold text-gray-800">
              À propos du module M10
            </p>
            <p className="mt-1">
              Ce tableau de bord consolide les données clés des commandes Marketplace et des missions GO.
            </p>
          </div>
        </section>

        {/* COLONNE DROITE : LISTES RÉCENTES */}
        <section className="space-y-4">
          {/* COMMANDES */}
          <div className="rounded-xl border bg-white p-4 shadow-sm space-y-3">
            <h2 className="text-sm font-semibold text-gray-900">
              Dernières commandes Marketplace
            </h2>
            <ul className="divide-y divide-gray-100 text-xs">
              {data.recentOrders.map((order) => (
                <li key={order.id} className="py-2 flex justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      Commande #{order.id}
                    </p>
                    <p className="text-[11px] text-gray-500">
                      Créée le {formatDateTime(order.createdAt)}
                    </p>
                  </div>
                  <Link href={`/dashboard/orders/${order.id}`} className="text-[11px] text-indigo-600 hover:underline">
                    Ouvrir →
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* MISSIONS GO */}
          <div className="rounded-xl border bg-white p-4 shadow-sm space-y-3">
            <h2 className="text-sm font-semibold text-gray-900">
              Dernières missions GO
            </h2>
            <ul className="divide-y divide-gray-100 text-xs">
              {data.recentGoJobs.map((job) => (
                <li key={job.id} className="py-2 flex justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      Mission GO #{job.id} — {job.title}
                    </p>
                    <p className="text-[11px] text-gray-500">
                      Créée le {formatDateTime(job.createdAt)}
                    </p>
                  </div>
                  <Link href={`/dashboard/go/${job.id}`} className="text-[11px] text-indigo-600 hover:underline">
                    Ouvrir →
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
