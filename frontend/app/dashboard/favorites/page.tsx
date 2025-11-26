import Link from "next/link";

export default async function FavoritesPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/favorites/list`, {
    cache: "no-store",
  });
  const { favorites = [] } = await res.json();

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Mes favoris</h1>

      {favorites.length === 0 ? (
        <p className="text-gray-500">Aucun favori pour le moment.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map((f: any) => {
            const p = f.product;
            return (
              <Link
                key={f.id}
                href={`/product/${p.id}`}
                className="bg-white border rounded-xl shadow-sm overflow-hidden hover:shadow-md"
              >
                <div className="h-40 bg-gray-100">
                  {p.photos[0] ? (
                    <img
                      src={p.photos[0].url}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-gray-400">Pas d’image</span>
                  )}
                </div>

                <div className="p-3 space-y-1">
                  <p className="font-medium text-sm line-clamp-1">
                    {p.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {p.category?.name || "-"}
                  </p>
                  <p className="text-sm font-semibold">
                    {p.price.toLocaleString("fr-FR", {
                      style: "currency",
                      currency: "EUR",
                    })}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}

