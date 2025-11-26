import prisma from "@/lib/prisma";
import TrackingForm from "@/components/marketplace/tracking/TrackingForm";
import TrackingTimeline from "@/components/marketplace/tracking/TrackingTimeline";

export default async function TrackingSellerPage({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  const order = await prisma.marketplaceOrder.findUnique({
    where: { id },
  });

  if (!order) return <p>Commande introuvable.</p>;

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-xl font-semibold">Suivi commande #{order.id}</h1>

      <TrackingTimeline order={order} />

      <TrackingForm orderId={order.id} />
    </main>
  );
}
