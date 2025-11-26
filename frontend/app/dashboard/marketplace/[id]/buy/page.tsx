// app/dashboard/marketplace/[id]/buy/page.tsx

import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function BuyPage({
  params,
}: {
  params: { id: string };
}) {
  const productId = Number(params.id);
  if (Number.isNaN(productId)) return notFound();

  const product = await prisma.marketplaceProduct.findUnique({
    where: { id: productId },
    include: { seller: true },
  });

  if (!product) return notFound();

  async function createSession() {
    "use server";
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/checkout/session`,
      {
        method: "POST",
        body: JSON.stringify({
          productId: product.id,
          buyerId: product.sellerId, // ⚠️ À remplacer par currentUser plus tard
        }),
      }
    );

    const data = await res.json();
    if (!data.url) throw new Error("Erreur création checkout.");
    return data.url;
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-6 space-y-6">
      <h1 className="text-xl font-semibold text-gray-900">Acheter ce produit</h1>

      <div className="rounded-xl border bg-white p-4 shadow-sm space-y-4">
        <p className="text-lg font-semibold">{product.title}</p>
        <p className="text-gray-600">{product.description}</p>

        <p className="text-2xl font-bold text-indigo-600">
          {product.price.toLocaleString("fr-FR", {
            style: "currency",
            currency: "EUR",
          })}
        </p>

        <form
          action={async () => {
            const url = await createSession();
            if (url) {
              // ⚠️ La redirection doit être faite dans le client
            }
          }}
        >
          <button
            type="submit"
            className="mt-4 w-full rounded-lg bg-indigo-600 px-4 py-2 text-white font-medium hover:bg-indigo-700"
          >
            Procéder au paiement
          </button>
        </form>
      </div>
    </main>
  );
}
