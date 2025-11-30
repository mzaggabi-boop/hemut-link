import prisma from "@/lib/prisma";
import Link from "next/link";

// FORMATTEUR DE PRIX
function formatCurrency(value: number) {
  return value.toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
  });
}

export const dynamic = "force-dynamic";

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string };
}) {
  const q = (searchParams.q ?? "").trim();
  const category = (searchParams.category ?? "").trim();

  /**
   * WHERE CLAUSE
   */
  const whereClause: any = { AND: [] };

  if (q.length > 0) {
    whereClause.AND.push({
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ],
    });
  }

  if (category.length > 0) {
    whereClause.AND.push({
      category: {
        is: { name: category },
      },
    });
  }

  if (whereClause.AND.length === 0) delete whereClause.AND;

  /**
   * PRODUITS
   */
  const products = await prisma.marketplaceProduct.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    include: {
      seller: true,
      category: true,
    },
  });

  /**
   * CATÉGORIES DISPONIBLES
   */
  const categories = await prisma.marketplaceProduct.findMany({
    select: { category: true },
    where: { categoryId: { not: null } },
    distinct: ["categoryId"],
    orderBy: { categoryId: "asc" },
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">
      <header className="flex flex-col gap-2 border-b border-gray-100 pb-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Marketplace — Catalogue
          </h1>
          <p className="text-xs text-gray-600">
            Parcourez les produits publiés par les professionnels du bâtiment.
          </p>
        </div>

        <Link
          href="/dashboard/marketplace/new"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition"
        >
          + Publier un produit
        </Link>
      </header>

      <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-4">
        <form className="flex flex-col gap-3 md:flex-row md:items-center">
          <input
            name="q"
            defaultValue={q}
            type="text"
            placeholder="Rechercher un produit..."
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />

          <select
            name="category"
            defaultValue={category}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">Toutes catégories</option>
            {categories.map((c, i) =>
              c.category ? (
                <option key={i} value={c.category.name}>
                  {c.category.name}
                </option>
              ) : null
            )}
          </select>

          <button
            type="submit"
            className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-900 transition"
          >
            Filtrer
          </button>
        </form>
      </section>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.length === 0 ? (
          <p className="col-span-full text-xs text-gray-500">
            Aucun produit trouvé.
          </p>
        ) : (
          products.map((product) => (
            <Link
              key={product.id}
              href={`/dashboard/marketplace/${product.id}`}
              className="block rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition"
            >
              <div className="aspect-[4/3] overflow-hidden rounded-lg bg-gray-100 mb-3">
                {product.coverImageUrl ? (
                  <img
                    src={product.coverImageUrl}
                    alt={product.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">
                    Pas d'image
                  </div>
                )}
              </div>

              <h3 className="text-sm font-semibold text-gray-900 truncate">
                {product.title}
              </h3>

              {product.seller && (
                <p className="mt-0.5 text-[11px] text-gray-500">
                  Vendeur :{" "}
                  <span className="font-medium text-gray-800">
                    {product.seller.firstname} {product.seller.lastname}
                  </span>
                </p>
              )}

              <p className="mt-2 text-sm font-semibold text-gray-900">
                {formatCurrency(product.price)}
              </p>
            </Link>
          ))
        )}
      </section>
    </main>
  );
}
