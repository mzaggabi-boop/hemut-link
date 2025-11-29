import prisma from "@/lib/prisma";
import { supabaseServer } from "@/lib/supabase-server";
import Link from "next/link";

export default async function MarketplaceSaleChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const orderId = Number(id);

  // ✅ FIX ABSOLU
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="p-6">
        <p className="text-red-600 text-sm">Non authentifié.</p>
      </main>
    );
  }

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
  });

  if (!dbUser) {
    return (
      <main className="p-6">
        <p className="text-red-600 text-sm">Utilisateur introuvable.</p>
      </main>
    );
  }

  const order = await prisma.marketplaceOrder.findUnique({
    where: { id: orderId },
    include: {
      product: true,
      buyer: true,
      seller: true,
    },
  });

  if (!order) {
    return (
      <main className="p-6">
        <p className="text-red-600 text-sm">Commande introuvable.</p>
      </main>
    );
  }

  // Vérification d’accès : uniquement vendeur
  if (order.sellerId !== dbUser.id) {
    return (
      <main className="p-6">
        <p className="text-red-600 text-sm">Accès refusé.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl p-6 space-y-6">
      <h1 className="text-xl font-semibold">Discussion commande #{order.id}</h1>

      <div className="p-4 border rounded-xl bg-white shadow-sm">
        <h2 className="text-sm font-medium mb-2">Produit</h2>
        <p className="text-gray-700">{order.product?.title}</p>
      </div>

      <div className="p-4 border rounded-xl bg-white shadow-sm">
        <h2 className="text-sm font-medium mb-2">Acheteur</h2>
        <p className="text-gray-700">{order.buyer?.email}</p>
      </div>

      <Link
        href={`/marketplace/order-chat/${order.id}`}
        className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
      >
        Ouvrir le chat
      </Link>
    </main>
  );
}
