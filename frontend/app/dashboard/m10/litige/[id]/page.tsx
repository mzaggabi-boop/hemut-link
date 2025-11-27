// app/dashboard/m10/litige/[orderId]/page.tsx
import { notFound, redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

function formatDate(date: Date) {
  return date.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function LitigeDetailPage({
  params,
}: {
  params: { orderId: string };
}) {
  const orderId = Number(params.orderId);
  if (Number.isNaN(orderId)) return notFound();

  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const order = await prisma.marketplaceOrder.findUnique({
    where: { id: orderId },
    include: {
      buyer: true,
      seller: true,
      product: true,
    },
  });

  if (!order || order.status !== "dispute") return notFound();

  const messages = await prisma.disputeMessage.findMany({
    where: { orderId },
    orderBy: { createdAt: "asc" },
    include: { sender: true },
  });

  async function postMessage(formData: FormData) {
    "use server";

    const currentUser = await getCurrentUser();
    if (!currentUser) redirect("/login");

    const content = String(formData.get("content") || "").trim();
    const rawOrderId = formData.get("orderId");
    const parsedOrderId = Number(rawOrderId);

    if (!content || Number.isNaN(parsedOrderId)) {
      redirect(`/dashboard/m10/litige/${orderId}`);
    }

    await prisma.disputeMessage.create({
      data: {
        orderId: parsedOrderId,
        senderId: currentUser.id,
        content,
      },
    });

    redirect(`/dashboard/m10/litige/${parsedOrderId}`);
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 space-y-6">
      <header className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Litige — Commande #{orderId}
          </h1>
          <p className="text-xs text-gray-600">
            Ouvert le {formatDate(order.createdAt)}
          </p>
        </div>
      </header>

      {/* Infos commande */}
      <section className="rounded-xl border bg-white p-4 shadow-sm space-y-2 text-xs text-gray-700">
        <p>
          Produit :{" "}
          <span className="font-medium">
            {order.product?.title ?? "Produit supprimé"}
          </span>
        </p>
        <p>
          Acheteur :{" "}
          <span className="font-medium">
            {order.buyer?.firstname} {order.buyer?.lastname}
          </span>{" "}
          ({order.buyer?.email})
        </p>
        <p>
          Vendeur :{" "}
          <span className="font-medium">
            {order.seller?.firstname} {order.seller?.lastname}
          </span>{" "}
          ({order.seller?.email})
        </p>
        <p className="text-[11px] text-gray-500">
          Statut actuel de la commande : <span className="font-medium">litige</span>
        </p>
      </section>

      {/* Messages du litige */}
      <section className="rounded-xl border bg-white p-4 shadow-sm space-y-4">
        <h2 className="text-sm font-semibold text-gray-900">
          Messages & échanges
        </h2>

        {messages.length === 0 ? (
          <p className="text-xs text-gray-500">
            Aucun message enregistré pour ce litige pour le moment.
          </p>
        ) : (
          <div className="space-y-3">
            {messages.map((m) => (
              <div key={m.id} className="rounded-lg border px-3 py-2 text-xs">
                <p className="font-semibold text-gray-900">
                  {m.sender.firstname} {m.sender.lastname}
                </p>
                <p className="mt-1 text-gray-700 whitespace-pre-wrap">
                  {m.content}
                </p>
                <p className="mt-1 text-[10px] text-gray-500">
                  {formatDate(m.createdAt)}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Formulaire de réponse */}
        <form action={postMessage} className="mt-4 space-y-2">
          <input type="hidden" name="orderId" value={orderId} />
          <label className="block text-xs font-medium text-gray-700">
            Répondre au litige
          </label>
          <textarea
            name="content"
            rows={3}
            className="w-full rounded-lg border px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="Ajouter un message au dossier de litige…"
            required
          />
          <button
            type="submit"
            className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"
          >
            Envoyer la réponse
          </button>
        </form>
      </section>
    </main>
  );
}
