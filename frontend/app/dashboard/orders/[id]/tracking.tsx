import prisma from "@/lib/prisma";
import TrackingTimeline from "@/components/marketplace/tracking/TrackingTimeline";

export default async function BuyerTrackingPage({
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
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">
        Suivi de votre commande #{order.id}
      </h1>

      <TrackingTimeline order={order} />
    </main>
  );
}
