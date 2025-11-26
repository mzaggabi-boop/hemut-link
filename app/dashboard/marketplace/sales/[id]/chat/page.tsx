// app/dashboard/marketplace/sales/[id]/chat/page.tsx
import { notFound, redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";

function formatDateTime(date: Date) {
  return date.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function sendMessage(formData: FormData) {
  "use server";

  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const orderIdRaw = formData.get("orderId");
  const content = String(formData.get("content") || "").trim();

  const orderId = Number(orderIdRaw);
  if (!orderIdRaw || Number.isNaN(orderId) || !content) {
    redirect(`/dashboard/marketplace/sales/${orderId}/chat`);
  }

  // Vérifier que la commande existe et que l'utilisateur est bien le vendeur
  const order = await prisma.marketplaceOrder.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      buyerId: true,
      sellerId: true,
    },
  });

  if (!order) notFound();

  if (order.sellerId !== user.id && order.buyerId !== user.id) {
    redirect("/dashboard");
  }

  await prisma.marketplaceOrderMessage.create({
    data: {
      orderId: order.id,
      senderId: user.id,
      content,
    },
  });

  redirect(`/dashboard/marketplace/sales/${order.id}/chat`);
}

export default async function SalesChatPage({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (Number.isNaN(id)) return notFound();

  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const order = await prisma.marketplaceOrder.findUnique({
    where: { id },
    include: {
      product: true,
      buyer: true,
      seller: true,
    },
  });

  if (!order) return notFound();

  // Le vendeur doit correspondre
  if (order.sellerId !== user.id) {
    redirect("/dashboard");
  }

  const messages = await prisma.marketplaceOrderMessage.findMany({
    where: { orderId: order.id },
    orderBy: { createdAt: "asc" },
    include: { sender: true },
  });

  const otherParty = order.buyer;

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 space-y-6">
      {/* HEADER */}
      <header className="flex flex-col gap-2 border-b border-gray-100 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              Chat vente – commande #{order.id}
            </h1>

            <p className="text-xs text-gray-600">
              Produit :{" "}
              <span className="font-medium text-gray-900">
                {order.product?.title ?? "Produit supprimé"}
              </span>
            </p>

            {otherParty && (
              <p className="text-[11px] text-gray-500">
                Avec l’acheteur :{" "}
                <span className="font-medium text-gray-800">
                  {otherParty.firstname} {otherParty.lastname}
                </span>{" "}
                ({otherParty.email})
              </p>
            )}
          </div>

          <Link
            href={`/dashboard/orders/${order.id}`}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-800 hover:bg-gray-50"
          >
            ← Retour commande
          </Link>
        </div>

        <p className="text-[11px] text-gray-500">
          Utilisez ce chat pour échanger avec l’acheteur concernant la vente.
        </p>
      </header>

      {/* CHAT */}
      <section className="flex h-[520px] flex-col rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Messages */}
        <div className="flex-1 space-y-2 overflow-y-auto px-3 py-3">
          {messages.length === 0 ? (
            <p className="text-xs text-gray-500 text-center mt-4">
              Aucun message pour le moment. Démarrez la conversation.
            </p>
          ) : (
            messages.map((msg) => {
              const fromCurrentUser = msg.senderId === user.id;
              return (
                <div
                  key={msg.id}
                  className={`flex ${
                    fromCurrentUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg px-3 py-2 text-xs shadow-sm ${
                      fromCurrentUser
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    {!fromCurrentUser && (
                      <p className="mb-0.5 text-[10px] font-semibold opacity-80">
                        {msg.sender.firstname} {msg.sender.lastname}
                      </p>
                    )}
                    <p className="whitespace-pre-wrap break-words">
                      {msg.content}
                    </p>
                    <p
                      className={`mt-1 text-[9px] ${
                        fromCurrentUser ? "text-indigo-100" : "text-gray-500"
                      }`}
                    >
                      {formatDateTime(msg.createdAt)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* FORMULAIRE */}
        <form
          action={sendMessage}
          className="border-t border-gray-200 p-3 flex gap-2"
        >
          <input type="hidden" name="orderId" value={order.id} />

          <textarea
            name="content"
            rows={2}
            className="flex-1 resize-none rounded-lg border border-gray-300 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="Écrire un message…"
            required
          />

          <button
            type="submit"
            className="self-end rounded-lg bg-indigo-600 px-3 py-2 text-xs font-medium text-white hover:bg-indigo-700"
          >
            Envoyer
          </button>
        </form>
      </section>
    </main>
  );
}
