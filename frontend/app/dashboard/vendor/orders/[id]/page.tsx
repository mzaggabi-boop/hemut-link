// app/dashboard/vendor/orders/[id]/page.tsx
import { notFound } from "next/navigation";
import { VendorStatusButtons } from "@/components/orders/VendorStatusButtons";

// À adapter à ton ORM (Prisma, Supabase, etc.)
async function getOrderById(orderId: string) {
  // Exemple Prisma :
  // return prisma.order.findUnique({ where: { id: orderId } });
  return null;
}

interface VendorOrderPageProps {
  params: { id: string };
}

export default async function VendorOrderPage({ params }: VendorOrderPageProps) {
  const order = await getOrderById(params.id);

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">
            Commande #{order.id}
          </h1>
          <p className="text-sm text-gray-500">
            Client : {order.customerName ?? "N/A"}
          </p>
        </div>
      </header>

      {/* Ton bloc existant : détail commande, produits, prix, etc. */}

      <section className="rounded-xl border bg-white p-4">
        <VendorStatusButtons
          orderId={order.id}
          currentStatus={order.status}
        />
      </section>

      {/* Ton composant existant de Suivi expédition / Timeline ici */}
    </div>
  );
}
