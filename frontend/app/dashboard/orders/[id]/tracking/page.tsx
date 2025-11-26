// app/dashboard/orders/[id]/tracking/page.tsx
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
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

const steps = [
  { key: "PAID", label: "Paiement confirmé" },
  { key: "SHIPPED", label: "Expédiée" },
  { key: "DELIVERED", label: "Livrée" },
];

function getStatusLabel(status: string) {
  switch (status) {
    case "pending":
    case "PENDING":
      return "En attente de paiement";
    case "paid":
    case "PAID":
      return "Payée";
    case "shipped":
    case "SHIPPED":
      return "Expédiée";
    case "delivered":
    case "DELIVERED":
      return "Livrée";
    default:
      return status;
  }
}

function getStatusIndex(status: string) {
  switch (status) {
    case "PAID":
    case "paid":
      return 0;
    case "SHIPPED":
    case "shipped":
      return 1;
    case "DELIVERED":
    case "delivered":
      return 2;
    default:
      return -1;
  }
}

export default async function TrackingPage({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (Number.isNaN(id)) notFound();

  const order = await prisma.marketplaceOrder.findUnique({
    where: { id },
    include: {
      product: true,
      buyer: true,
      seller: true,
    },
  });

  if (!order) return notFound();

  const statusIndex = getStatusIndex(order.status);

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 space-y-6">
      {/* HEADER */}
      <header className="flex flex-col gap-2 border-b border-gray-100 pb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">
            Suivi d’expédition — Commande #{order.id}
          </h1>

          <Link
            href={`/dashboard/orders/${order.id}`}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-800 hover:bg-gray-50"
          >
            ← Retour
          </Link>
        </div>

        <p className="text-xs text-gray-600">
          Produit :{" "}
          <span className="font-medium text-gray-900">
            {order.product?.title ?? "Produit supprimé"}
          </span>
        </p>

        <p className="text-[11px] text-gray-500">
          Dernier statut :{" "}
          <span className="font-medium text-gray-900">
            {getStatusLabel(order.status)}
          </span>
        </p>
      </header>

      {/* TIMELINE */}
      <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-6">
        <h2 className="text-sm font-semibold text-gray-900">Suivi du colis</h2>

        <ol className="relative border-l border-gray-200 ml-4 space-y-8">
          {steps.map((step, index) => {
            const done = index <= statusIndex;

            return (
              <li key={step.key} className="ml-4">
                <div
                  className={`absolute -left-2 flex h-4 w-4 items-center justify-center rounded-full border ${
                    done
                      ? "bg-indigo-600 border-indigo-600"
                      : "bg-gray-200 border-gray-300"
                  }`}
                ></div>

                <p
                  className={`text-sm font-medium ${
                    done ? "text-indigo-700" : "text-gray-700"
                  }`}
                >
                  {step.label}
                </p>

                {done ? (
                  <p className="text-xs text-gray-500">
                    Mis à jour le {formatDate(order.updatedAt)}
                  </p>
                ) : (
                  <p className="text-xs text-gray-400">
                    En attente de cette étape…
                  </p>
                )}
              </li>
            );
          })}
        </ol>
      </section>
    </main>
  );
}
