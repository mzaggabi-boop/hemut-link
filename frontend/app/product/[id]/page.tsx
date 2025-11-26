// app/product/[id]/page.tsx
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { buildProductStructuredData, getSiteUrl } from "@/lib/seo";
import FavoriteButton from "@/components/FavoriteButton";

// SEO dynamique
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const productId = Number(params.id);
  if (Number.isNaN(productId)) return {};

  const product = await prisma.marketplaceProduct.findUnique({
    where: { id: productId },
    include: {
      photos: true,
      category: true,
    },
  });

  if (!product) return {};

  const siteUrl = getSiteUrl();
  const url = `${siteUrl}/product/${product.id}`;
  const imageUrl = product.photos[0]?.url;

  const title = `${product.title} — Hemut-link Marketplace`;
  const description =
    product.description?.slice(0, 160) ||
    "Annonce de matériel professionnel sur Hemut-link.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "product",
      url,
      images: imageUrl ? [{ url: imageUrl }] : [],
    },
    alternates: { canonical: url },
  };
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const productId = Number(params.id);
  if (Number.isNaN(productId)) return notFound();

  const product = await prisma.marketplaceProduct.findUnique({
    where: { id: productId },
    include: {
      photos: true,
      category: true,
      seller: { include: { businessProfile: true } },
      tags: { include: { tag: true } },
      favorites: true,
    },
  });

  if (!product) return notFound();

  const structuredData = buildProductStructuredData({
    id: product.id,
    title: product.title,
    description: product.description,
    price: product.price,
    currency: "EUR",
    imageUrl: product.photos[0]?.url || null,
  });

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-8">

      {/* JSON-LD SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* HEADER PRODUIT */}
      <section className="bg-white border rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-start justify-between">
          <h1 className="text-2xl font-semibold">{product.title}</h1>

          {/* BOUTON FAVORIS */}
          <FavoriteButton
            productId={product.id}
            initialFavorite={product.favorites.length > 0}
          />
        </div>

        <p className="text-xl font-bold text-gray-900">
          {product.price.toLocaleString("fr-FR", {
            style: "currency",
            currency: "EUR",
          })}
        </p>

        <p className="text-sm text-gray-500">
          Catégorie : {product.category?.name || "—"}
        </p>

        {product.condition && (
          <p className="text-sm text-gray-500">
            État : {product.condition}
          </p>
        )}
      </section>

      {/* PHOTOS */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {product.photos.length > 0 ? (
          product.photos.map((p) => (
            <div key={p.id} className="rounded-lg overflow-hidden bg-gray-100 shadow-sm">
              <img
                src={p.url}
                alt={product.title}
                className="w-full h-80 object-cover"
              />
            </div>
          ))
        ) : (
          <div className="text-sm text-gray-400">Aucune image</div>
        )}
      </section>

      {/* DESCRIPTION */}
      {product.description && (
        <section className="bg-white border rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Description</h2>
          <p className="text-gray-700 text-sm whitespace-pre-line">{product.description}</p>
        </section>
      )}

      {/* TAGS */}
      {product.tags.length > 0 && (
        <section className="bg-white border rounded-xl p-6 shadow-sm space-y-3">
          <h2 className="text-lg font-semibold">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {product.tags.map((pt) => (
              <span
                key={pt.id}
                className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700"
              >
                {pt.tag.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* VENDEUR */}
      <section className="bg-white border rounded-xl p-6 shadow-sm space-y-3">
        <h2 className="text-lg font-semibold">Vendeur</h2>

        <p className="font-medium text-sm">
          {product.seller.companyName ||
            `${product.seller.firstname} ${product.seller.lastname}`}
        </p>

        {product.seller.businessProfile?.address && (
          <p className="text-gray-600 text-sm">
            📍 {product.seller.businessProfile.address}
          </p>
        )}

        <Link
          href={`/dashboard/messages/create?to=${product.seller.id}`}
          className="inline-block px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-900"
        >
          Contacter le vendeur
        </Link>
      </section>
    </main>
  );
}

