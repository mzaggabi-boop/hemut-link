import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import StatusBadge from "@/components/marketplace/StatusBadge";
import TimelineExpedition from "@/components/marketplace/TimelineExpedition";
import InvoiceButton from "@/components/marketplace/InvoiceButton";

export default async function MarketplaceOrderDetail({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (Number.isNaN(id)) return notFound();

  const order = await prisma.marketplaceOrder.findUnique({
    where: { id },
    include: {
      buyer: true,
      seller: true,
      product: true,
    },
  });

  if (!order) return notFound();

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Commande #{order.id}
          </h1>
          <p className="text-sm text-gray-600">
            Du {order.createdAt.toLocaleString("fr-FR")}
          </p>
        </div>

        <StatusBadge status={order.status} />
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        {/* Produit */}
        <div className="rounded-xl border bg-white p-4 shadow-sm space-y-4">
          <h2 className="text-sm font-semibold text-gray-900">
            Produit acheté
          </h2>

          <p className="text-lg font-semibold text-gray-900">
            {order.product?.title}
          </p>

          <p className="text-sm text-gray-700">
            Prix :{" "}
            {order.total.toLocaleString("fr-FR", {
              style: "currency",
              currency: "EUR",
            })}
          </p>
        </div>

        {/* Suivi expédition */}
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900">
            Suivi de l’expédition
          </h2>

          <TimelineExpedition current={order.status} />
        </div>
      </section>

      {/* Facture */}
      {order.status === "paid" || order.status === "delivered" ? (
        <div className="pt-4 border-t">
          <InvoiceButton orderId={order.id} />
        </div>
      ) : null}
    </main>
  );
}
