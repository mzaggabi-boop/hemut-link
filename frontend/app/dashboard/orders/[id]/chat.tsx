import prisma from "@/lib/prisma";
import ChatBox from "@/components/marketplace/order-chat/ChatBox";
import { supabaseServer } from "@/lib/supabase-server";

export default async function OrderChatBuyer({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const orderId = Number(id);

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
  });

  if (!order) {
    return (
      <main className="p-6">
        <p className="text-red-600 text-sm">Commande introuvable.</p>
      </main>
    );
  }

  if (order.buyerId !== dbUser.id) {
    return (
      <main className="p-6">
        <p className="text-red-600 text-sm">Accès interdit.</p>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-xl font-semibold">
        Chat commande #{order.id}
      </h1>

      <ChatBox orderId={order.id} currentUserId={dbUser.id} />
    </main>
  );
}
