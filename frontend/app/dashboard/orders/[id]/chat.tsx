import prisma from "@/lib/prisma";
import ChatBox from "@/components/marketplace/order-chat/ChatBox";
import { supabaseServer } from "@/lib/supabase-server";

export default async function OrderChatBuyer({ params }: any) {
  const id = Number(params.id);

  const supabase = supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return <p>Non authentifié</p>;

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
  });

  const order = await prisma.marketplaceOrder.findUnique({ where: { id } });

  if (!order) return <p>Commande introuvable</p>;
  if (order.buyerId !== dbUser?.id) return <p>Accès interdit</p>;

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-xl font-semibold">
        Chat commande #{order.id}
      </h1>

      <ChatBox orderId={order.id} currentUserId={dbUser.id} />
    </main>
  );
}
