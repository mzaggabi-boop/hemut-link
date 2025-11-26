// CODE CREATE PAGE - A REMPLACER
// app/dashboard/products/create/page.tsx
import prisma from "@/lib/prisma";
import ProductCreateForm from "./ProductCreateForm";

export default async function CreateProductPage() {
  const categories = await prisma.marketplaceCategory.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-gray-900">
          Créer une nouvelle annonce
        </h1>
        <p className="text-sm text-gray-600">
          Publiez votre matériel sur la marketplace Hemut-link.
        </p>
      </header>

      <ProductCreateForm categories={categories} />
    </main>
  );
}
