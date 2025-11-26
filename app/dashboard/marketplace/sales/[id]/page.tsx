import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import StatusBadge from "@/components/marketplace/StatusBadge";
import TimelineExpedition from "@/components/marketplace/TimelineExpedition";
import SellerActionButtons from "@/components/marketplace/SellerActionButtons";

export default async function SaleDetailPage({
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
      product: true,
      seller: true,
    },
  });

  if (!order) return notFound();

  return (
    <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">
            Commande #{order.id}
          </h1>
          <p className="text-xs text-gray-500">
            Reçue le {order.createdAt.toLocaleString("fr-FR")}
          </p>
        </div>

        <StatusBadge status={order.status} />
      </header>

      {/* Infos produit */}
      <div className="rounded-xl border bg-white p-4 shadow-sm space-y-2">
        <h2 className="text-sm font-semibold text-gray-900">Produit</h2>
        <p className="text-lg font-semibold">{order.product?.title}</p>
        <p className="text-sm text-gray-700">
          Prix : {order.total} €
        </p>
      </div>

      {/* Timeline */}
      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-900">
          Suivi expédition
        </h2>
        <TimelineExpedition current={order.status} />
      </div>

      {/* Actions */}
      <div className="border-t pt-4">
        <SellerActionButtons
          orderId={order.id}
          currentStatus={order.status}
        />
      </div>
    </main>
  );
}
