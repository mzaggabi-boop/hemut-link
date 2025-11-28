// app/dashboard/marketplace/new/page.tsx
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

function formatCurrencyPreview(value: number | null) {
  if (!value) return "";
  return value.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}

async function createProduct(formData: FormData) {
  "use server";

  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const image = String(formData.get("image") || "").trim();
  const priceRaw = String(formData.get("price") || "").replace(",", ".").trim();

  if (!title || !priceRaw) {
    redirect("/dashboard/marketplace/new");
  }

  const price = Number(priceRaw);
  if (Number.isNaN(price) || price < 0) {
    redirect("/dashboard/marketplace/new");
  }

  // ✅ FIX : use MarketplaceProduct
  const product = await prisma.marketplaceProduct.create({
    data: {
      title,
      description,
      categoryId: null, // category is now an ID (MarketplaceCategory)
      coverImageUrl: image || null,
      price,
      sellerId: user.id,
    },
  });

  redirect(`/dashboard/marketplace/${product.id}`);
}

export default async function NewMarketplaceProductPage() {
  // Récupération catégories depuis MarketplaceCategory
  const categories = await prisma.marketplaceCategory.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 space-y-6">
      {/* HEADER */}
      <header className="border-b border-gray-100 pb-4 space-y-1">
        <h1 className="text-xl font-semibold text-gray-900">
          Publier un produit — Marketplace
        </h1>
        <p className="text-xs text-gray-600">
          Créez une nouvelle annonce visible dans la marketplace Hemut-link.
        </p>
      </header>

      {/* FORM */}
      <form
        action={createProduct}
        className="space-y-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
      >
        {/* Title + Category */}
        <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="space-y-1">
            <label
              htmlFor="title"
              className="block text-xs font-medium text-gray-700"
            >
              Titre du produit *
            </label>
            <input
              id="title"
              name="title"
              required
              type="text"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              placeholder="Ex : Perceuse sans fil 18V"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="category"
              className="block text-xs font-medium text-gray-700"
            >
              Catégorie
            </label>
            <select
              id="category"
              name="category"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              defaultValue=""
            >
              <option value="">Aucune / Autre</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Price + image */}
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="space-y-1">
            <label
              htmlFor="price"
              className="block text-xs font-medium text-gray-700"
            >
              Prix TTC (€) *
            </label>
            <input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              placeholder="Ex : 120.00"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="image"
              className="block text-xs font-medium text-gray-700"
            >
              URL de l'image
            </label>
            <input
              id="image"
              name="image"
              type="url"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              placeholder="https://exemple.com/image.jpg"
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label
            htmlFor="description"
            className="block text-xs font-medium text-gray-700"
          >
            Description détaillée
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            placeholder="État, marque, quantité, etc."
          />
        </div>

        {/* ACTION */}
        <div className="flex items-center justify-between border-t border-dashed pt-2">
          <p className="text-[11px] text-gray-500">
            Une fois publiée, l’annonce apparaîtra dans la Marketplace.
          </p>

          <button
            type="submit"
            className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Publier le produit
          </button>
        </div>
      </form>
    </main>
  );
}
