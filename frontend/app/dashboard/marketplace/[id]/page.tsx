// app/dashboard/marketplace/[id]/page.tsx
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

function formatCurrency(value: number | null) {
  if (value === null) return "—";
  return value.toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
  });
}

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (Number.isNaN(id)) return notFound();

  // FIX : prisma.product ➜ prisma.marketplaceProduct
  const product = await prisma.marketplaceProduct.findUnique({
    where: { id },
    include: {
      seller: true,
    },
  });

  if (!product) return notFound();

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 space-y-6">
      {/* HEADER */}
      <header className="flex flex-col gap-3 border-b pb-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            {product.title}
          </h1>
          <p className="text-sm text-gray-600">
            Produit #{product.id} — ajouté le{" "}
            {product.createdAt.toLocaleDateString("fr-FR")}
          </p>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-2">
          <Link
            href={`/dashboard/marketplace/${product.id}/buy`}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Acheter
          </Link>

          <Link
            href={`/dashboard/marketplace/sales/${product.id}/chat`}
            className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200"
          >
            Contacter le vendeur
          </Link>
        </div>
      </header>

      {/* CONTENU */}
      <div className="grid gap-6 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        {/* COLONNE GAUCHE – IMAGE + DESCRIPTION */}
        <section className="space-y-4">
          {/* IMAGE */}
          <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
            {product.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-80 object-cover"
              />
            ) : (
              <div className="flex h-80 items-center justify-center text-gray-400">
                Pas d'image
              </div>
            )}
          </div>

          {/* DESCRIPTION */}
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-900">
              Description du produit
            </h2>
            <p className="mt-2 whitespace-pre-wrap text-xs text-gray-700">
              {product.description || "Aucune description fournie."}
            </p>
          </div>
        </section>

        {/* COLONNE DROITE – INFO VENDEUR */}
        <aside className="space-y-4">
          {/* INFO PRODUIT */}
          <div className="rounded-xl border bg-white p-4 shadow-sm space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">
              Informations produit
            </h3>

            <p className="text-lg font-semibold text-gray-900">
              {formatCurrency(product.price)}
            </p>

            {product.category && (
              <p className="text-xs text-gray-600">
                Catégorie :{" "}
                <span className="font-medium text-gray-900">
                  {product.category}
                </span>
              </p>
            )}

            <p className="text-[11px] text-gray-500">
              Paiement sécurisé et libération des fonds via Hemut-link Pay.
            </p>
          </div>

          {/* INFO VENDEUR */}
          <div className="rounded-xl border bg-white p-4 shadow-sm space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">Vendeur</h3>

            {product.seller ? (
              <div className="space-y-1 text-xs text-gray-700">
                <p className="font-medium text-gray-900">
                  {product.seller.firstname} {product.seller.lastname}
                </p>
                <p>{product.seller.email}</p>
              </div>
            ) : (
              <p className="text-xs text-gray-500">Vendeur non identifié.</p>
            )}

            <Link
              href={`/dashboard/marketplace/sales/${product.id}/chat`}
              className="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100"
            >
              Contacter le vendeur
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
