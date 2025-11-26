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
    // On pourrait afficher des erreurs plus fines via un pattern plus avancé,
    // mais on garde ici une validation minimale côté serveur.
    redirect("/dashboard/marketplace/new");
  }

  const price = Number(priceRaw);
  if (Number.isNaN(price) || price < 0) {
    redirect("/dashboard/marketplace/new");
  }

  const product = await prisma.product.create({
    data: {
      title,
      description,
      category: category || null,
      image: image || null,
      price,
      sellerId: user.id,
    },
  });

  redirect(`/dashboard/marketplace/${product.id}`);
}

export default async function NewMarketplaceProductPage() {
  // On récupère les catégories déjà utilisées pour proposer un choix
  const categories = await prisma.product.findMany({
    select: { category: true },
    where: { category: { not: null } },
    distinct: ["category"],
    orderBy: { category: "asc" },
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

      {/* FORMULAIRE */}
      <form
        action={createProduct}
        className="space-y-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
      >
        {/* Titre & catégorie */}
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
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Ex : Perceuse sans fil 18V, lot de dalles, etc."
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
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              defaultValue=""
            >
              <option value="">Aucune / Autre</option>
              {categories.map((c, index) =>
                c.category ? (
                  <option key={index} value={c.category}>
                    {c.category}
                  </option>
                ) : null
              )}
            </select>
          </div>
        </div>

        {/* Prix & image */}
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
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Ex : 120.00"
            />
            <p className="text-[11px] text-gray-500">
              Montant en euros, TTC. Le paiement passera ensuite par Batilink
              Pay / Stripe.
            </p>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="image"
              className="block text-xs font-medium text-gray-700"
            >
              URL de l&apos;image
            </label>
            <input
              id="image"
              name="image"
              type="url"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="https://… (image hébergée)"
            />
            <p className="text-[11px] text-gray-500">
              Vous pourrez plus tard connecter l&apos;upload direct (Supabase
              Storage, S3, etc.).
            </p>
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
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="Détaillez l'état, la marque, les conditions, la quantité, etc."
          />
        </div>

        {/* ACTIONS */}
        <div className="flex items-center justify-between pt-2 border-t border-dashed border-gray-200">
          <p className="text-[11px] text-gray-500">
            Une fois publiée, l&apos;annonce apparaîtra dans la liste du
            catalogue Marketplace.
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
