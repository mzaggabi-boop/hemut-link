// app/dashboard/m10/calendrier/page.tsx
import prisma from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

function formatDate(date: Date) {
  return date.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function CalendrierPage() {
  const [orders, goJobs] = await Promise.all([
    prisma.marketplaceOrder.findMany({
      where: { status: { in: ["shipped", "delivered"] } },
      orderBy: { createdAt: "desc" },
      include: {
        buyer: true,
        seller: true,
        product: true,
      },
    }),

    prisma.goJob.findMany({
      where: { status: { in: ["ACCEPTED", "IN_PROGRESS", "COMPLETED"] } },
      orderBy: { createdAt: "desc" },
      include: {
        client: true,
        artisan: true,
      },
    }),
  ]);

  const events = [
    ...orders.map((o) => ({
      type: "ORDER" as const,
      id: o.id,
      date: o.createdAt,
      title: o.product?.title ?? "Commande",
      buyer: o.buyer,
      seller: o.seller,
      status: o.status,
    })),
    ...goJobs.map((j) => ({
      type: "GO" as const,
      id: j.id,
      date: j.createdAt,
      title: j.title,
      client: j.client,
      artisan: j.artisan,
      status: j.status,
    })),
  ];

  events.sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">
      <header className="flex flex-col gap-2 border-b border-gray-100 pb-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Calendrier des interventions (M10)
          </h1>
          <p className="text-xs text-gray-600">
            Vue chronologique des commandes expédiées/livrées et des missions GO
            acceptées/en cours/réalisées.
          </p>
        </div>
      </header>

      <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-4">
        <h2 className="text-sm font-semibold text-gray-900">
          Événements chronologiques
        </h2>

        {events.length === 0 ? (
          <p className="text-xs text-gray-500">
            Aucun événement à afficher pour le moment.
          </p>
        ) : (
          <ul className="divide-y divide-gray-100 text-xs">
            {events.map((event) => {
              const isOrder = event.type === "ORDER";
              return (
                <li
                  key={`${event.type}-${event.id}`}
                  className="flex items-start justify-between py-3"
                >
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-gray-900">
                      {isOrder
                        ? `Commande #${event.id}`
                        : `Mission GO #${event.id}`}{" "}
                      — {event.title}
                    </p>
                    <p className="text-[11px] text-gray-500">
                      Le {formatDate(event.date)}
                      {isOrder && event.buyer && (
                        <>
                          {" "}
                          • Client{" "}
                          <span className="font-medium">
                            {event.buyer.firstname} {event.buyer.lastname}
                          </span>
                        </>
                      )}
                      {!isOrder && event.client && (
                        <>
                          {" "}
                          • Client{" "}
                          <span className="font-medium">
                            {event.client.firstname} {event.client.lastname}
                          </span>
                        </>
                      )}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className="inline-flex rounded-full bg-gray-50 border px-2 py-0.5 text-[11px] font-medium text-gray-700">
                      {event.status}
                    </span>

                    {isOrder ? (
                      <Link
                        href={`/dashboard/orders/${event.id}`}
                        className="text-[11px] font-medium text-indigo-600 hover:underline"
                      >
                        Voir la commande →
                      </Link>
                    ) : (
                      <Link
                        href={`/dashboard/go/${event.id}`}
                        className="text-[11px] font-medium text-indigo-600 hover:underline"
                      >
                        Voir la mission →
                      </Link>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
